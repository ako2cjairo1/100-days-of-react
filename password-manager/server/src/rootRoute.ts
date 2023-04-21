import express from "express"
import { Logger } from "./utils"

const rootRouter = express.Router()

rootRouter.get("/heartbeat", (req, res) => {
	Logger.info("Just checking if server is up!")
	res.status(200).send("I'm alive")
})

export { rootRouter }
