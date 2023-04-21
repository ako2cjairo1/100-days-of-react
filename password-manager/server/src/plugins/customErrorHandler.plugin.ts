import { Request, Response, NextFunction } from "express"
import { CreateError } from "../utils/helper"
import { Logger } from "../utils/logger"

export function customErrorPlugin(
	err: unknown,
	_req: Request,
	res: Response,
	next: NextFunction
) {
	// OK, proceed to next action
	if (!err) next()

	// unknown error, create custom error
	let error = CreateError(err)

	//* for client: override error properties accordingly */
	// override error message for status 401
	if (error.status === 400) error.message = "Bad Request!"
	// override error message for status 401
	if (error.status === 401) error.message = "Unauthorized!"

	const { status, message } = error

	// server log the error with readable message
	if (status >= 400 && status <= 499) Logger.warn(error, message)
	if (status >= 500) Logger.error(error, message)

	// set the status and send the error object as response
	res.status(status).send({
		status,
		message,
	})
}
