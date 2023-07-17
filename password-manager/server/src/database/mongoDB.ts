import mongoose from "mongoose"
import { Logger, ParameterStore } from "../utils"

export async function connectToMongoDB() {
	try {
		Logger.info("Connecting to MongoDB...")

		await mongoose.connect(ParameterStore.MONGODB_URL, {
			retryWrites: true,
			w: "majority",
		})
		console.clear()
		return Logger.info("Connection to MongoDB -> Success")
	} catch (error) {
		Logger.error(error, "Unable to connect to MongoDB.")
		process.exit(1)
	}
}

export async function disconnectFromMongoDB() {
	await mongoose.connection.close()
	return Logger.info("MongoDB disconnected!")
}
