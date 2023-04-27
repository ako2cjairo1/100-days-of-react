import { PMServer } from "./utils"
import { app } from "./app"
import { connectToMongoDB } from "./database"

// immediately invoke connection to database and server
;(async function () {
	console.clear()
	// initiate and connect to MongoDB
	await connectToMongoDB()

	// create instance of server
	const server = PMServer(app)

	// start http server
	server.start()
})()
