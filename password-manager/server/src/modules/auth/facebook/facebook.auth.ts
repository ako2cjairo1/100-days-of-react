import { Request, Response, NextFunction } from "express"
import type { IReqExt } from "../../../type"
import {
	CreateError,
	Logger,
	buildTokens,
	createCookies,
	removeCookies,
} from "../../../utils"
import { ParameterStore } from "../../../constant"
import {
	createUser,
	deleteUserById,
	getUserByEmail,
	loginUserById,
} from "../../user"
import { createVault, deleteVaultByUserId, getVaultByUserId } from "../../vault"
import { getFacebookUser } from "./facebook.service"

async function rollbackFacebookPassportActions(res: Response, userId?: string) {
	try {
		removeCookies(res)
		if (userId) {
			/* DB transactions to delete User and their Vault */
			await deleteUserById(userId)
			await deleteVaultByUserId(userId)
		}
	} catch (err) {
		const error = CreateError(err)
		error.name = "Rollback Facebook Passport Error"
		Logger.warn(error)
	}
}

export async function facebookPassport(
	req: IReqExt<Request>,
	res: Response,
	next: NextFunction
) {
	let userId = ""
	let email = ""
	let version = ""

	try {
		// expected "code" from Facebook OAuth as callback url
		const code = req.query.code || res.locals.code || ""
		const verifiedFacebookUser = await getFacebookUser(code)

		if (verifiedFacebookUser) {
			const facebookEmail = `facebook+${
				verifiedFacebookUser.email || verifiedFacebookUser.name
			}`
			const existingUser = await getUserByEmail(facebookEmail)

			if (existingUser) {
				/** user is already registered proceed to login */
				userId = existingUser._id.toString()
				email = existingUser.email
				version = existingUser.version || ""
			} else {
				/** register facebook user and generate user._id */
				const newUser = await createUser({
					email: facebookEmail,
					// format of password for OAuth Users (id + email)
					password: `${verifiedFacebookUser.id}:${facebookEmail}`,
				})

				userId = newUser._id.toString()
				email = newUser.email
				version = newUser.version || ""

				await createVault({ userId })
			}

			// get Vault of User from db
			const vault = await getVaultByUserId(userId)
			if (!vault) {
				rollbackFacebookPassportActions
				return res
					.status(405) // method not allowed
					.json({ message: "We can't find your Vault" })
			}

			// generate pair of tokens using authenticated Facebook User(_Id, email, version, etc.)
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
		rollbackFacebookPassportActions(res, userId)
		// parse unknown err
		let error = CreateError(err)
		// default error message
		error.message = "Facebook Passport Error"
		error.status = 400
		// send formatted error to error handler plugin
		next(error)
	}
}
