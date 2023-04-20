import pino from "pino"
import { Request, Response, NextFunction } from "express"

export const Logger = pino({
	transport: {
		target: "pino-pretty",
		options: {
			ignore: "hostname,pid",
			colorize: true,
		},
	},
})

export function ApiLogger(
	request: Request,
	response: Response,
	next: NextFunction
) {
	Logger.info(`${request.method} ${request.originalUrl}`)
	const startTime = new Date().getTime()
	response.on("finish", () => {
		const elapsedTime = new Date().getTime() - startTime
		Logger.info(
			`${request.method} ${request.originalUrl} ${response.statusCode} ${elapsedTime}ms`
		)
	})
	next()
}
