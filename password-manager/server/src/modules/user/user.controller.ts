import { Request, Response } from "express"
import { TUser } from "../../types/User.type"
import { createUser } from "../user"
import { createVault } from "../vault"
import { CreateError, Logger, generateSalt, jwtSign } from "../../utils"

export async function registerUser(req: Request, res: Response) {
	const user = req.body as TUser // TODO: create object validation for props

	try {
		// create user and generate user._id
		const registerUser = await createUser(user)
		const salt = generateSalt()

		// subsequently create vault and assign user._id
		const { vault } = await createVault({
			user: registerUser._id.toString(),
			salt,
		})
		// create access token using the created user
		const accessToken = jwtSign({
			_id: registerUser._id,
			email: registerUser.email,
			// iat: will be included here
		})
		// send a 201:"Created" status with accessToken
		res.status(201).send({ accessToken, vault, salt })
	} catch (err) {
		// parse unknown err
		const error = CreateError(err)
		const { code, errorObj } = error
		// default error props
		let responseObj = {
			status: error.status,
			message: "Error creating user",
			errorObj: err,
		}

		// override code:11000 as "Duplicate email" error
		if (code === 11000) {
			responseObj = {
				status: 400,
				message: "Duplicate Email",
				errorObj: errorObj.keyValue,
			}
		}

		// extract error props for client
		const { status, message } = responseObj
		// server log custom error obj with readable message
		Logger.error(error, message)
		// respond with assigned response code (status) and formatted error
		res.status(status).send({ status, message })
	}
}
