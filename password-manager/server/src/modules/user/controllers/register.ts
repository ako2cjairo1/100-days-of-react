import { Response, NextFunction } from "express"
import { createUser, deleteUserById } from "../user.service"
import { createVault, deleteVaultByUserId } from "../../vault"
import { CreateError } from "../../../utils"
import type { IReqExt } from "../../../type"
import type { IUserModel, TCredentials } from "@shared"

export async function createUserAndVault({ email, password }: TCredentials) {
	/** register github user and generate user._id */
	const newUser = await createUser({
		email,
		password,
	})
	// format _id from ObjectID to string
	const userId = newUser._id.toString()
	// create Vault using user._id
	// data: initial value of empty array of objects..
	// salt: is created on pre-save to database (use to generate vaultKey for client)
	const { data: encryptedVault, salt } = await createVault({ userId })

	return { user: { ...newUser, userId }, vault: { encryptedVault, salt } }
}
export async function registerHandler(
	req: IReqExt<TCredentials>,
	res: Response,
	next: NextFunction
) {
	let userId = ""
	try {
		const {
			user: { userId, email, version },
		} = await createUserAndVault({ ...req.body })

		// build User's information and send back to client
		//! Make sure not to send Password to client
		const newUser: Pick<IUserModel, "userId" | "email" | "version"> = {
			userId,
			email,
			version,
		}
		// 201:Created
		return res.status(201).json({ newUser })
	} catch (err) {
		if (userId) {
			// something went wrong, rollback registration
			await deleteUserById(userId)
			await deleteVaultByUserId(userId)
		}

		// parse unknown err
		let error = CreateError(err)
		// default error message
		error.message = "Error creating user"

		// override code:11000 as "Duplicate email" error
		if (error.code === 11000) {
			error.status = 409
			error.message = "email already exist"
		}
		// send formatted error to error handler plugin
		next(error)
	}
}
