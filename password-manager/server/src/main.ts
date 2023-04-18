import { PasswordManagerServer } from "./utils/createServer"
import { disconnectFromMongoDB } from "./utils/monggoDB"
import { Logger } from "./utils/logger"

async function gracefulShutdown(signal: string, closeCallbackFn: () => void) {
	process.on(signal, async () => {
		Logger.info(`Server is closing, got signal ${signal}`)
		closeCallbackFn()

		await disconnectFromMongoDB()
		Logger.info("Done closing the server.")

		process.exit(1)
	})
}

;(() => {
	// create instance of server
	const { connect, close } = PasswordManagerServer()
	// listen to port
	connect()

	// execute signals
	const signals = ["SIGTERM", "SIGINT"]
	for (const signal of signals) {
		gracefulShutdown(signal, close)
	}
})()
