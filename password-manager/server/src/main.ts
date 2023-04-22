import { PMServer, app } from "./utils"
import { connectToMongoDB } from "./database"

// immediately invoke connection to database and server
;(async function () {
	// initiate and connect to MongoDB
	await connectToMongoDB()

	// create instance of server
	const server = PMServer(app)

	// start http server
	server.start()
})()
