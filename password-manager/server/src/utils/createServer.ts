import dotenv from "dotenv"
import http from "http"
import { app } from "./app"
import { Logger } from "./logger"

// config process env
dotenv.config()
const PORT = process.env.PORT || 8080

export function PasswordManagerServer() {
	const server = http.createServer(app)

	const connect = () => {
		try {
			server.listen(PORT, () => {
				Logger.info(`Server running on port ${PORT}`)
			})
		} catch (error) {
			Logger.error(error)
			process.exit(1)
		}
	}

	const close = () => server.close()

	return {
		connect,
		close,
	}
}
