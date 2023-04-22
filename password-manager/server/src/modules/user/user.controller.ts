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
		res.cookie("PM_accessToken", accessToken, {
			secure: true,
			httpOnly: false,
			sameSite: true,
			signed: true,
		})
		// respond a 201:"Created" status with payload
		return res.status(201).send({ accessToken, vault, salt })
	} catch (err) {
		// parse unknown err
		let error = CreateError(err)

		// default error message
		error.message = "Error creating user"

		// override code:11000 as "Duplicate email" error
		if (error.code === 11000) {
			error.status = 409
			error.message = "email already exist"
			error.errorObj = error.errorObj.keyValue
		}

		// pass formatted error to error handler plugin
		next(error)
	}
}

export async function createUserSessionHandler(req: Request, res: Response) {
	// validate email and master password
	// create session
	// create access token
	// create refresh token
}
