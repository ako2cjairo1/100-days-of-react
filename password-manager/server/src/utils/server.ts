import dotenv from "dotenv"
import http from "http"
import { Express } from "express"
import { Logger } from "./logger"

// config process env
dotenv.config()

export function PMServer(app: Express) {
	const PORT = process.env.PORT || 8080
	const server = http.createServer(app)

	return {
		start() {
			try {
				server.listen(PORT, () => {
					Logger.info(`Server running on port ${PORT}`)
				})
			} catch (error) {
				Logger.error(error)
				process.exit(1)
			}
		},
		close() {
			server.close()
		},
	}
}
