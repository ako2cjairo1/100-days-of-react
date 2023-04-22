import env from "dotenv"
import mongoose from "mongoose"
import { Logger } from "../utils/logger"

env.config()
const MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost:27017/password-manager"

export async function connectToMongoDB() {
	try {
		Logger.info("Connecting to MongoDB...")

		await mongoose.connect(MONGODB_URI, {
			retryWrites: true,
			w: "majority",
		})

		return Logger.info("MongoDB connected!")
	} catch (error) {
		Logger.error(error, "Error connecting to MongoDB.")
		process.exit(1)
	}
}

export async function disconnectFromMongoDB() {
	await mongoose.connection.close()
	return Logger.info("MongoDB disconnected!")
}
