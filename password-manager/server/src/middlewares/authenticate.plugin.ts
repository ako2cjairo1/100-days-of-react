import { NextFunction, Response, Request } from "express"
import { Cookies } from "../constant"
import { Logger } from "../utils"

export function authenticate(_req: Request, res: Response, next: NextFunction) {
	if (!res.locals[Cookies.User]) {
		// send Forbidden status when no validSession found
		return res.status(403).json({ message: "Not Signed in" })
	}

	Logger.warn(res.locals[Cookies.User])
	next()
}
