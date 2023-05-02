import { Request, NextFunction } from "express"
import { CreateError, removeCookies } from "../../../utils"
import { logoutUserById } from "../user.service"
import { IResExt, IUserModel } from "../../../type"

export async function logoutHandler(
	_req: Request,
	res: IResExt<IUserModel>,
	next: NextFunction
) {
	try {
		// TODO: invalidate tokens used
		// remove tokens from session cookies
		removeCookies(res)
		// update login status and increase token "version" (for refreshToken)
		await logoutUserById(res.user?.userId) //res.locals[Cookies.User]

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
