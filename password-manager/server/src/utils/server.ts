import dotenv from "dotenv"
import http from "http"
import { Express } from "express"
import { Logger } from "./logger"
import { disconnectFromMongoDB } from "../database"

// config process env
dotenv.config()

export function PMServer(app: Express) {
	const PORT = process.env.PORT || 8080
	const server = http.createServer(app)

	const close = () => server.close()
	const gracefulShutdown = async (signal: string) => {
		process.on(signal, async () => {
			Logger.warn(`${signal} received. Server is closing...`)

			close()
			await disconnectFromMongoDB()

			process.exit(1)
		})
	}
	const start = () => {
		try {
			server.listen(PORT, () => {
				Logger.info(`Server running on port ${PORT}`)
			})

			const signals = ["SIGTERM", "SIGINT"]
			// execute signals
			signals.map((signal) => gracefulShutdown(signal))
		} catch (error) {
			Logger.error(error)
			process.exit(1)
		}
	}

	return {
		start,
		close,
	}
}
