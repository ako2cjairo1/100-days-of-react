import { Request, Response, NextFunction } from "express"
import { CreateError, extractToken, verifyAccessToken } from "../utils"

export async function AuthMiddleware(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const token = extractToken(req)
		const accessToken = verifyAccessToken(token)

		if (!accessToken) throw new Error("Invalid Token")

		res.locals.token = accessToken
		next()
	} catch (err) {
		// parse unknown err
		let error = CreateError(err)
		// default error message
		error.status = 401
		// send formatted error to error handler plugin
		next(error)
	}
}
