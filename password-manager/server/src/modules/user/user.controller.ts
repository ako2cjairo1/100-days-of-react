import { Request, Response } from "express"
import { TUser } from "../../types/User.type"
import { Logger } from "../../utils/logger"
import { createUser, extractJWT } from "./user.service"

export async function registerUser(req: Request, res: Response) {
	const user = req.body as TUser // TODO: create object validation for props
	const token = extractJWT(req)

	Logger.info(user)
	Logger.info(token)

	createUser(user)

	res.status(200).send(token)
}
