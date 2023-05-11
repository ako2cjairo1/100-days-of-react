import { Response, NextFunction } from "express"
import { authenticateUser, loginUserById } from "../user.service"
import { getVaultByUserId } from "../../vault"
import { CreateError, Logger, buildTokens, createCookies } from "../../../utils"
import { IReqExt, IUserModel } from "../../../type"
import { TCredentials } from "@shared"

export async function loginHandler(
	req: IReqExt<TCredentials>,
	res: Response,
	next: NextFunction
) {
	let loginUser: Partial<IUserModel> = { email: req.body.email }
	try {
		// find user and verify the hashed password
		const authUser = await authenticateUser({ ...req.body })

		if (!authUser) {
			return res
				.status(401)
				.json({ message: "Invalid email or password." })
		}

		if (authUser) {
			const { _id, email, version, password } = authUser
			const userId = _id.toString()
			loginUser = { ...authUser, userId }
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
				version,
			})
			// store signed tokens into cookies
			createCookies(res, { accessToken, refreshToken })
			// update user as loggedIn (optional)
			await loginUserById(userId)

			const { data, salt } = vault
			// login success: send accessToken, vault data and salt (to generate vault key)
			return res.status(200).json({
				accessToken,
				email,
				hashedPassword: password,
				salt,
				encryptedVault: data,
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
	} finally {
		Logger.info({
			action: "LOGIN",
			userId: loginUser.userId,
			email: loginUser.email,
		})
	}
}
