import { Request, NextFunction } from "express"
import { CreateError, Logger, removeCookies } from "../../../utils"
import { logoutUserById } from "../user.service"
import { IResExt, IUserModel } from "../../../type"

export async function logoutHandler(
	_req: Request,
	res: IResExt<IUserModel>,
	next: NextFunction
) {
	const user = res.user
	try {
		// clear the cookies to invalidate session
		removeCookies(res)
		// check if user session is authenticated
		if (!user) {
			return res
				.status(400)
				.json({ message: "Logout action could not be completed." })
		}
		// update login status and increase token "version" (for refreshToken)
		await logoutUserById(user.userId)

		return res.sendStatus(204).end()
	} catch (err) {
		// parse unknown err
		let error = CreateError(err)
		// default error message
		error.message = "Error logging out"
		// send formatted error to error handler plugin
		return next(error)
	} finally {
		Logger.info({
			action: "LOGOUT",
			userId: user?.userId,
			email: user?.email,
		})
	}
}
