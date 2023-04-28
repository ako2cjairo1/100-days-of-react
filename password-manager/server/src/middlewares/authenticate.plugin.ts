import { NextFunction, Response, Request } from "express"
import { Cookies } from "../constant"
import { Logger } from "../utils"

export function authenticate(_req: Request, res: Response, next: NextFunction) {
	Logger.warn(res.locals)

	// !Note: JWT validation is done on deserializeSession middleware..
	// !hence, we'll just check if the authenticated user is present in "locals"
	if (!res.locals[Cookies.User]) {
		// send Forbidden status when no validSession found
		return res.status(403).json({ message: "Not Signed in" })
	}
	next()
}
