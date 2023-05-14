import express from "express"
import { userRouter, vaultRoute } from "./modules"
import { authenticate } from "./middleware"

export const apiRoute = express
	.Router()
	.get("/heartbeat", (_req, res) =>
		res.status(200).json({ message: "I'm alive" })
	)
	// User base uri
	.use("/user", userRouter)
	// Vault base uri
	.use("/vault", authenticate, vaultRoute)
