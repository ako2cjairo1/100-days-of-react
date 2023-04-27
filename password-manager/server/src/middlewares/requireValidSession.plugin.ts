import { NextFunction, Response, Request } from "express"
import { Cookies } from "../constant"

export function requireValidSession(
	_req: Request,
	res: Response,
	next: NextFunction
) {
	// send Forbidden status when no validSession found
	if (!res.locals[Cookies.AccessToken]) {
		return res.status(403).json({ message: "Not Signed in" })
	}
	next()
}
