import { NextFunction, Request } from "express"
import { IResExt, TVerifiedToken } from "../type"

export function authenticate(
	_req: Request,
	res: IResExt<TVerifiedToken>,
	next: NextFunction
) {
	const user = res.user
	//! Note: JWT validation is done on deserializeSession middleware..
	//! hence, we'll just check if the authenticated user is present in "locals"
	if (!user) {
		// send Unauthorize status when no validSession found
		return res.status(401).json({ message: "You're not signed-in" })
	}
	next()
}
