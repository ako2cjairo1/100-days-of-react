import { Logger, PMServer, app } from "./utils"
import { connectToMongoDB, disconnectFromMongoDB } from "./database"

async function gracefulShutdown(signal: string, closeCallbackFn: () => void) {
	process.on(signal, async () => {
		Logger.info(`Server is closing, got signal ${signal}`)
		closeCallbackFn()

		await disconnectFromMongoDB()
		Logger.info("Done closing the server.")

		process.exit(1)
	})
}

;(async () => {
	// create instance of server
	const server = PMServer(app)
	// start http server
	server.start()
	// initiate and connect to MongoDB
	connectToMongoDB()

	const signals = ["SIGTERM", "SIGINT"]
	// execute signals
	signals.map((signal) => gracefulShutdown(signal, server.close))
})()
