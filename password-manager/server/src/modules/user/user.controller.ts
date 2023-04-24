import { NextFunction, Request, Response } from "express"
import { TUser } from "../../types/User.type"
import { createUser } from "../user"
import { createVault } from "../vault"
import { CreateError, Logger, generateSalt, jwtSign } from "../../utils"

export async function registerUserHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const user: TUser = {
			email: req.body.email,
			password: req.body.password,
		}
		// create user and generate user._id
		const { _id: userId, email } = await createUser(user)
		// create access token using the created user
		const accessToken = jwtSign({
			_id: userId.toString(),
			email: email,
		})

		const salt = generateSalt()
		// subsequently create vault and assign user._id
		const { _id: vaultId } = await createVault({
			user: userId.toString(),
			salt,
		})

		return sendAuthenticatedVault(res, {
			accessToken,
			salt,
			vaultId: vaultId.toString(),
		})
	} catch (err) {
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

interface IPayload {
	accessToken: string
	vaultId: string
	salt: string
}
function sendAuthenticatedVault(
	res: Response,
	{ accessToken, salt, vaultId }: IPayload
) {
	res.cookie("PM_accessToken", accessToken, {
		secure: true,
		httpOnly: false,
		sameSite: true,
		signed: true,
	})
	// respond a 201:"Created" status with payload
	return res.status(201).send({ accessToken, salt, vaultId })
}
