import env from "dotenv"
import { Response, NextFunction } from "express"
import {
	CreateError,
	Logger,
	buildTokens,
	createCookies,
	removeCookies,
} from "../../../utils"
import {
	createUser,
	deleteUserById,
	getUserByEmail,
	loginUserById,
} from "../../user"
import type { IReqExt } from "../../../type"
import { TGithubCredentials } from "../../../../../shared/types.shared"
import { createVault, deleteVaultByUserId, getVaultByUserId } from "../../vault"
import { ParameterStore } from "../../../constant"
import { getGithubUser } from "./github.service"
env.config()

async function rollbackGithubPassportActions(res: Response, userId?: string) {
	try {
		removeCookies(res)
		if (userId) {
			/* DB transactions to delete User and their Vault */
			await deleteUserById(userId)
			await deleteVaultByUserId(userId)
		}
	} catch (err) {
		const error = CreateError(err)
		error.name = "Rollback Github Passport Error"
		Logger.warn(error)
	}
}

export async function githubPassport(
	req: IReqExt<TGithubCredentials>,
	res: Response,
	next: NextFunction
) {
	let userId = ""
	let email = ""
	let version = ""

	try {
		// expected "code" from Github OAuth as callback url
		const code = req.query.code || res.locals.code || ""
		const verifiedGithubUser = await getGithubUser(code)

		if (verifiedGithubUser) {
			const githubEmail = `github+${
				verifiedGithubUser.email || verifiedGithubUser.login
			}`
			const existingUser = await getUserByEmail(githubEmail)

			if (existingUser) {
				/** user is already registered proceed to login */
				userId = existingUser._id.toString()
				email = existingUser.email
				version = existingUser.version || ""
			} else {
				/** register github user and generate user._id */
				const newUser = await createUser({
					email: githubEmail,
					// format of password for OAuth Users (id + email)
					password: `${verifiedGithubUser.id}:${githubEmail}`,
				})

				userId = newUser._id.toString()
				email = newUser.email
				version = newUser.version || ""

				await createVault({ userId })
			}

			// get Vault of User from db
			const vault = await getVaultByUserId(userId)
			if (!vault) {
				return res
					.status(405) // method not allowed
					.json({ message: "We can't find your Vault" })
			}

			// generate pair of tokens using authenticated Github User(_Id, email, version, etc.)
			const { accessToken, refreshToken } = buildTokens({
				userId,
				email,
				version, // required to generate refreshToken
			})
			// store signed tokens into cookies
			createCookies(res, { accessToken, refreshToken })
			// update user as loggedIn (optional)
			await loginUserById(userId)

			return res.redirect(ParameterStore.AUTH_CLIENT_REDIRECT_URL)
		}

		return next()
	} catch (err) {
		// something went wrong, rollback registration
		rollbackGithubPassportActions(res, userId)
		// parse unknown err
		let error = CreateError(err)
		// default error message
		error.message = "Github Passport Error"
		error.status = 400
		// send formatted error to error handler plugin
		next(error)
	}
}
