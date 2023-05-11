import { Response, NextFunction } from "express"
import { createUser, deleteUserById } from "../user.service"
import { createVault, deleteVaultByUserId } from "../../vault"
import { CreateError, signToken } from "../../../utils"
import { ParameterStore, TokenMaxAge } from "../../../constant"
import { IReqExt } from "../../../type"
import { TCredentials } from "@shared"

export async function registerHandler(
	req: IReqExt<TCredentials>,
	res: Response,
	next: NextFunction
) {
	let userId = ""
	try {
		// create user and generate user._id
		const { _id, email, version } = await createUser({ ...req.body })

		userId = _id.toString()
		// create Vault using user._id
		const { data: encryptedVault, salt } = await createVault({ userId })
		// data: initial value of empty array of objects..
		// salt: is created on pre-save to database (use to generate vaultKey for client)

		// create access token using the created user
		const accessToken = signToken(
			{ userId, email, version },
			{
				expiresIn: TokenMaxAge.Access,
				secretOrPrivateKey: ParameterStore.ACCESS_TOKEN_SECRET,
			}
		)
		// registration successful: send accessToken, vault and salt (to generate vault key)
		return res.status(201).json({ accessToken, encryptedVault, salt })
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
