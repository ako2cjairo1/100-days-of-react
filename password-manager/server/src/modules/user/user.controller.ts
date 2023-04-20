import { Request, Response } from "express"
import { TUser } from "../../types/User.type"
import { createUser } from "../user"
import { createVault } from "../vault"
import { CreateError, generateSalt, jwtSign } from "../../utils"

export async function registerUser(req: Request, res: Response) {
	const body = req.body as TUser // TODO: create object validation for props

	try {
		// create user and generate user._id
		const user = await createUser(body)
		const salt = generateSalt()
		// subsequently create vault and assign user._id
		const { vault } = await createVault({ user: user._id.toString(), salt })

		// create access token and send to response
		const accessToken = jwtSign({ _id: user._id, email: user.email })
		res.status(201).send({ accessToken, vault, salt })
	} catch (error) {
		const { code, status, errorObj } = CreateError(error)
		let responseObj = { message: "Error creating user", error }

		if (code === 11000) {
			// create "Duplicate key Error"
			responseObj = {
				message: "Duplicate Error",
				error: errorObj.keyValue,
			}
		}

		res.status(status).send(responseObj)
	}
}
