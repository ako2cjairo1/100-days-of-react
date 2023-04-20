import dotenv from "dotenv"
import http from "http"
import { Logger } from "./logger"

// config process env
dotenv.config()

export function PMServer(listener: any) {
	const PORT = process.env.PORT || 8080
	const server = http.createServer(listener)

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
