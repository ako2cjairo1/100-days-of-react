import { Request, Response, NextFunction } from "express"
import { Logger } from "../utils"

export function activityLogger(
	req: Request,
	res: Response,
	next: NextFunction
) {
	const { method, originalUrl } = req
	const startTime = new Date().getTime()

	Logger.info(`${method}: ${originalUrl}`)
	res.on("finish", () => {
		const { statusCode, statusMessage } = res
		const elapsedTime = new Date().getTime() - startTime
		Logger.info(
			`==> [${statusCode}] ${statusMessage} ${originalUrl} [${elapsedTime}ms]`
		)
	})
	next()
}
