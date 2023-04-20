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
	const error = CreateError(err)
	const { status, message } = error

	Logger.error(message, error)

	// set the status and send the error object as response
	res.status(status).send({
		status,
		error,
	})
}
