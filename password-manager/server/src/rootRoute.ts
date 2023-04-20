import express from "express"
import { Logger } from "./utils"

const rootRouter = express.Router()

rootRouter.get("/api", (req, res) => {
	Logger.info("Henlo from root!")
	res.send("I'm alive")
})

export { rootRouter }
