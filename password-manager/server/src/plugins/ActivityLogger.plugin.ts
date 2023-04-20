import { Logger } from "../utils"
import { Request, Response, NextFunction } from "express"

export function ActivityLogger(
	request: Request,
	response: Response,
	next: NextFunction
) {
	Logger.info(`[${request.method}] -> ${request.originalUrl}`)
	const startTime = new Date().getTime()

	response.on("finish", () => {
		const elapsedTime = new Date().getTime() - startTime
		Logger.info(
			`[${request.method}] -> ${request.originalUrl} -  ${response.statusCode} (${elapsedTime}ms)`
		)
	})
	next()
}
