import { Request, Response, NextFunction } from "express"

export function NotFound(
	_request: Request,
	response: Response,
	_next: NextFunction
) {
	response.status(404).send({ message: "Requested resource not found." })
}
