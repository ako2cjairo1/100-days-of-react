import { Request, Response, NextFunction } from "express"
import { createUser, deleteUserById } from "../user.service"
import { createVault, deleteVaultByUserId } from "../../vault"
import { CreateError, generateSalt, signToken } from "../../../utils"
import { ParameterStore, TokenExpiration } from "../../../constant"

export async function registerHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	let userId = ""
	try {
		// create user and generate user._id
		const { _id, email } = await createUser({
			email: req.body.email,
			password: req.body.password,
		})

		userId = _id.toString()
		// create Vault by referencing to user._id
		// and with initial vault data as blank value
		const { data, salt } = await createVault({
			userId,
			salt: generateSalt(), // use to generate vaultKey for client
			data: "",
		})

		// create access token using the created user
		const accessToken = signToken(
			{ userId, email },
			{
				expiresIn: TokenExpiration.Access,
				secretOrPrivateKey: ParameterStore.ACCESS_TOKEN_SECRET,
			}
		)
		// registration successful: send accessToken, vault and salt (to generate vault key)
		return res.status(201).json({ accessToken, vault: data, salt })
	} catch (err) {
		console.error(err)

		// rollback registration
		await deleteUserById(userId)
		await deleteVaultByUserId(userId)

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
