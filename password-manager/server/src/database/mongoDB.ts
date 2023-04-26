import mongoose from "mongoose"
import { Logger } from "../utils"
import { ParameterStore } from "../constant"

export async function connectToMongoDB() {
	try {
		Logger.info("Connecting to MongoDB...")

		await mongoose.connect(ParameterStore.MONGODB_URL, {
			retryWrites: true,
			w: "majority",
		})

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
