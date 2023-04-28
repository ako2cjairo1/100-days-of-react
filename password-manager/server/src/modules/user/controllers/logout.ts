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
		// from "deserializeSession" middleware
		const { userId } = res.locals[Cookies.User]

		if (!userId) return res.status(401).json({ message: "User not found!" })

		if (userId) {
			// remove tokens from session cookies
			// !IMP: client should also delete tokens from memory (auth state)
			removeCookies(res)
			// update login status to database
			await logoutUserById(userId)
		}
	} catch (err) {
		// parse unknown err
		let error = CreateError(err)
		// default error message
		error.message = "Error logging out"
		// send formatted error to error handler plugin
		return next(error)
	}

	res.sendStatus(204).end()
}
