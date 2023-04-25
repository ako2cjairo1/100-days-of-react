import http from "http"
import { Express } from "express"
import { Logger } from "."
import { disconnectFromMongoDB } from "../database"
import { ParameterStore } from "../constant"

export function PMServer(app: Express) {
	const server = http.createServer(app)

	const close = () => {
		server.close()
		Logger.info("Server is closed!")
	}
	const shutdownServer = async (signal: string) => {
		process.on(signal, async () => {
			Logger.warn(`${signal} received. Server is closing...`)
			close()
			await disconnectFromMongoDB()
			process.exit(1)
		})
	}
	const start = () => {
		try {
			const PORT = ParameterStore.SERVER_PORT
			server.listen(PORT, () =>
				Logger.info(`Server is running on port ${PORT}`)
			)

			const signals = ["SIGTERM", "SIGINT"]
			// execute signals
			signals.map((signal) => shutdownServer(signal))
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
