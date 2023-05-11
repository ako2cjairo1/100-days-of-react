import { Request, Response, NextFunction } from "express"
import { CreateError, Logger } from "../utils"

export function errorHandler(
	err: unknown,
	_req: Request,
	res: Response,
	next: NextFunction
) {
	// OK, proceed to next action
	if (!err) next()

	// unknown error, create custom error
	let error = CreateError(err)
	const { status, message } = error

	//* for client: override error properties accordingly */
	// override error message for status 401
	if (status === 400) error.message = `Bad Request! ${message}`
	// override error message for status 401
	if (status === 401) error.message = `Unauthorized! ${message}`

	// server log the error with readable message
	if (status >= 400 && status <= 499) Logger.warn(message, error)
	if (status >= 500) Logger.error(message, error)

	// set the status and send the error object as response
	res.status(status).json({
		status,
		message,
	})
}

export function invalidRouteHandler(
	_request: Request,
	response: Response,
	_next: NextFunction
) {
	response.status(404).json({ message: "Requested resource not found." })
}
