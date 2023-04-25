import { Logger } from "../utils"
import { Request, Response, NextFunction } from "express"

export function ActivityLogger(
	request: Request,
	response: Response,
	next: NextFunction
) {
	const { method, originalUrl, hostname, ip } = request
	Logger.info(
		`In  -> [${method}] - ${originalUrl} - host/IP[${hostname}:${ip}]`
	)
	const startTime = new Date().getTime()

	response.on("finish", () => {
		const elapsedTime = new Date().getTime() - startTime
		Logger.info(
			`Out -> [${response.statusMessage}: ${response.statusCode}] - ${originalUrl} - (${elapsedTime}ms)`
		)
	})
	next()
}
