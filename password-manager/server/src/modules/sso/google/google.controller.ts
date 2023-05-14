import { Request, Response, NextFunction } from "express"
import type { IReqExt } from "../../../type"
import { CreateError, buildTokens, createCookies } from "../../../utils"
import { ParameterStore } from "../../../constant"
import {
	getUserByEmail,
	loginUserById,
	createUserAndVault,
	rollbackRegistrationActions,
} from "../../user"
import { getVaultByUserId } from "../../vault"
import { getGoogleUser } from "./google.service"

export async function googlePassport(
	req: IReqExt<Request>,
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
		// expected "code" from Google OAuth as callback url
		const code = req.query.code || res.locals.code || ""
		const verifiedGoogleUser = await getGoogleUser(code)

		if (verifiedGoogleUser) {
			const googleEmail = `google+${
				verifiedGoogleUser.email || verifiedGoogleUser.name
			}`
			const existingUser = await getUserByEmail(googleEmail)

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
				/** register google User and create their Vault */
				const { user: newUser } = await createUserAndVault({
					email: googleEmail,
					// format of password for OAuth Users (userId + email)
					password: `${verifiedGoogleUser.id}:${googleEmail}`,
				})

				userId = newUser.userId
				email = newUser.email
				version = newUser.version || ""
			}

			// generate pair of tokens using authenticated Google User(_Id, email, version, etc.)
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
		error.message = "Google Passport Error"
		error.status = 400
		// send formatted error to error handler plugin
		next(error)
	}
}
