import { IResExt, IUserModel } from "../../../type"
import { CreateError, Logger, parseToken } from "../../../utils"
import { NextFunction, Request } from "express"
import { getUserById } from "../user.service"
import { getVaultByUserId } from "../../vault"

export async function sessionHandler(
	req: Request,
	res: IResExt<IUserModel>,
	next: NextFunction
) {
	const user = res.user
	try {
		// check if user session is authenticated
		if (!user) {
			return res.status(401).json({ message: "You're not signed-in" })
		}

		const userFromDB = await getUserById(user.userId)
		if (!userFromDB) {
			return res.status(400).json({ message: "User not found" })
		}

		// parse cookies, query string and Bearer token
		const { accessToken } = parseToken(req)
		const { _id, email, password, isLoggedIn } = userFromDB

		// assumes sso authenticated and logged-in
		if (!isLoggedIn) {
			return res.status(401).json({ message: "No valid session" })
		}

		// get user vault from db using userId
		const vault = await getVaultByUserId(_id.toString())

		if (!vault) {
			return res
				.status(405) // method not allowed
				.json({ message: "We can't find your Vault" })
		}

		const { data, salt } = vault
		return res.status(200).json({
			accessToken,
			email,
			hashedPassword: password,
			salt,
			encryptedVault: data,
		})
	} catch (err) {
		// parse unknown err
		let error = CreateError(err)
		// default error message
		error.message = "Active Session Error"
		error.status = 400
		// send formatted error to error handler plugin
		next(error)
	} finally {
		Logger.info({
			action: "SSO LOGIN",
			userId: user?.userId,
			email: user?.email,
		})
	}
}
