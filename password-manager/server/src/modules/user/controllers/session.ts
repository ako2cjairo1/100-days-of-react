import { IResExt, IUserModel } from "../../../type"
import { CreateError, parseToken } from "../../../utils"
import { NextFunction, Request } from "express"
import { getUserById } from "../user.service"
import { getVaultByUserId } from "../../vault"

export async function sessionHandler(
	req: Request,
	res: IResExt<IUserModel>,
	next: NextFunction
) {
	try {
		// check if user session is authenticated
		if (!res.user) {
			return res
				.status(401)
				.json({ message: "You're not signed-in or session timed out" })
		}

		const user = await getUserById(res.user.userId)
		if (!user) {
			return res.status(400).json({ message: "User not found" })
		}

		// parse cookies, query string and Bearer token
		const { accessToken } = parseToken(req)
		const { _id, email, password } = user

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
	}
}
