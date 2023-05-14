import env from "dotenv"
import { Response, NextFunction } from "express"
import { CreateError, buildTokens, createCookies } from "../../../utils"
import {
	createUserAndVault,
	getUserByEmail,
	loginUserById,
	rollbackRegistrationActions,
} from "../../user"
import { getVaultByUserId } from "../../vault"
import type { IReqExt } from "../../../type"
import type { TGithubCredentials } from "@shared"
import { ParameterStore } from "../../../constant"
import { getGithubUser } from "./github.service"
env.config()

export async function githubPassport(
	req: IReqExt<TGithubCredentials>,
	res: Response,
	next: NextFunction
) {
	let userId = ""
	let email = ""
	let version = ""

	try {
		// something went wrong? do not continue and proceed to error handler
		if (req.query.error) {
			return next(req.query.error)
		}
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

				// get Vault of User from db
				const vault = await getVaultByUserId(userId)
				if (!vault) {
					return res
						.status(405) // method not allowed
						.json({ message: "We can't find your Vault" })
				}
			} else {
				/** register github user and generate user._id */
				const { user: newUser } = await createUserAndVault({
					email: githubEmail,
					// format of password for OAuth Users (id + email)
					password: `${verifiedGithubUser.id}:${githubEmail}`,
				})

				userId = newUser.userId
				email = newUser.email
				version = newUser.version || ""
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

		return res.status(401).json({ message: "Not Verified" })
	} catch (err) {
		// something went wrong, rollback registration
		rollbackRegistrationActions(res, userId)
		// parse unknown err
		let error = CreateError(err)
		// default error message
		error.message = "Github Passport Error"
		error.status = 400
		// send formatted error to error handler plugin
		next(error)
	}
}
