import { Request, Response, NextFunction } from "express"
import { Logger } from "../utils"

export function activityLogger(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { method, originalUrl, hostname, ip } = req
	const startTime = new Date().getTime()

	Logger.info(`==> ${method}: ${originalUrl} -> host/IP[${hostname}:${ip}]`)
	res.on("finish", () => {
		const elapsedTime = new Date().getTime() - startTime
		Logger.info(
			`==> [ ${res.statusCode}: ${res.statusMessage} ] -> ${originalUrl} -> (${elapsedTime}ms)`
		)
	})
	next()
}
