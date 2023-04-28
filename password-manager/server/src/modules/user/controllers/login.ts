import { Request, Response, NextFunction } from "express"
import { TUser } from "../../../types"
import { authenticateByEmailAndPassword, loginUserById } from "../user.service"
import { getVaultByUserId } from "../../vault"
import { CreateError, buildTokens, setCookies } from "../../../utils"

export async function loginHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const loginCredential: TUser = {
			email: req.body.email,
			password: req.body.password,
		}

		// find user and verify the hashed password
		const authenticatedUser = await authenticateByEmailAndPassword(
			loginCredential
		)
		if (!authenticatedUser) {
			return res
				.status(401)
				.json({ message: "Invalid email or password." })
		}

		if (authenticatedUser) {
			const { _id, email, version } = authenticatedUser
			const userId = _id.toString()

			// get user vault from db using userId
			const vault = await getVaultByUserId(userId)

			if (!vault) {
				return res
					.status(405) // method not allowed
					.json({ message: "We can't find your Vault" })
			}

			// generate pair of tokens using authenticated user(_Id, email, version, etc.)
			const { accessToken, refreshToken } = buildTokens({
				userId,
				email,
				// increment for refresh token validation
				version: (version || 0) + 1,
			})

			// store signed tokens into cookies
			setCookies(res, { accessToken, refreshToken })
			// update user as loggedIn (optional)
			await loginUserById(userId)

			const { data, salt } = vault
			// login success: send accessToken, vault data and salt (to generate vault key)
			return res.status(200).json({
				accessToken,
				vault: data,
				salt,
			})
		}

		throw Error("Login failed!")
	} catch (err) {
		// parse unknown err
		let error = CreateError(err)
		// default error message
		error.message = "Access Denied!"
		error.status = 401
		// send formatted error to error handler plugin
		next(error)
	}
}
