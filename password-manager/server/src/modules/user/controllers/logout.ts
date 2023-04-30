import { Request, Response, NextFunction } from "express"
import { Cookies } from "../../../constant"
import { CreateError, removeCookies } from "../../../utils"
import { logoutUserById } from "../user.service"

export async function logoutHandler(
	_req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		// TODO: invalidate tokens used
		// from "deserializeSession" middleware
		const { userId } = res.locals[Cookies.User]

		// remove tokens from session cookies
		removeCookies(res)
		// update login status and increase token "version" (for refreshToken)
		await logoutUserById(userId)

		return res.sendStatus(204).end()
	} catch (err) {
		// parse unknown err
		let error = CreateError(err)
		// default error message
		error.message = "Error logging out"
		// send formatted error to error handler plugin
		return next(error)
	}
}
