import env from "dotenv"
import mongoose from "mongoose"
import { Logger } from "./logger"

env.config()
const MONGODB_URI =
	process.env.MONGODB_URI || "mongodb://localhost:27017/password-manager"

export async function connectToMongoDB() {
	try {
		await mongoose.connect(MONGODB_URI)
	} catch (error) {
		Logger.error(error, "Error connecting to Mongodb Database.")
		process.exit(1)
	}
}

export async function disconnectFromMongoDB() {
	await mongoose.connection.close()
	return Logger.info("Disconnected from Mongodb Database.")
}
