import { Request, Response, NextFunction } from "express"
import { Logger } from "../utils"

export function activityLogger(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { method, originalUrl, socket } = req
	const protectedUrl = originalUrl.replace(/(?<==)[^&]+/g, "***")
	const startTime = new Date().getTime()

	Logger.info(`${method}: ${protectedUrl} ${socket.remoteAddress}`)
	res.on("finish", () => {
		const { statusCode, statusMessage } = res
		const elapsedTime = new Date().getTime() - startTime
		Logger.info(
			`--> [${statusCode}|${statusMessage}] (took ${elapsedTime}ms) ${protectedUrl} ${socket.remoteAddress}`
		)
	})
	next()
}
