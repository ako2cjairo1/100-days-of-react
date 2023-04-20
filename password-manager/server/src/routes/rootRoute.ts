import { Logger } from "../utils/logger"
import express from "express"

const rootRouter = express.Router()

rootRouter.get("/api", (req, res) => {
	Logger.info("Henlo from root!")
	res.send("I'm alive")
})

export { rootRouter }
