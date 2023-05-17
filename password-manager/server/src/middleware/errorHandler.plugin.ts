import { Request, Response, NextFunction } from "express"
import { CreateError, Logger } from "../utils"
import { ParameterStore } from "../constant"

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
	return res.redirect(
		`${ParameterStore.AUTH_CLIENT_REDIRECT_URL}/error?${new URLSearchParams(
			{
				status: status.toString(),
				error: message,
			}
		).toString()}`
	)
}

export function invalidRouteHandler(
	req: Request,
	res: Response,
	_next: NextFunction
) {
	// log for admin audit
	if (req.query["error"]) {
		Logger.error({
			error: req.query["error"],
			description: req.query["error_description"],
			uri: req.query["error_uri"],
		})
	}

	// set the status and send the error object as response
	return res.redirect(
		`${ParameterStore.AUTH_CLIENT_REDIRECT_URL}/error?${new URLSearchParams(
			{
				status: "404",
				error: "Requested resource not found.",
			}
		).toString()}`
	)
}
