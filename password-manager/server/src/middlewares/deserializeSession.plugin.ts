import { Request, Response, NextFunction } from "express"
import { CreateError, parseToken, verifyAccessToken } from "../utils"

export async function deserializeSession(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const token = parseToken(req)
		// no token to verify, move to next action
		if (!token) return next()
		// verify the token signature
		const { accessToken } = verifyAccessToken(token)
		if (accessToken) {
			// set the verified access token to response locals
			res.locals.accessToken = accessToken
			next()
		}
	} catch (err) {
		// send formatted error to error handler plugin
		next(CreateError(err))
	}
}
