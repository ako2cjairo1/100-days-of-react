import express from "express"
import { userRouter, vaultRoute } from "./modules"
import { UserEndpointLimiter, authenticate } from "./middleware"
import { githubRouter } from "./modules/github/github.route"

export const rootRoute = express
	.Router()
	.get("/heartbeat", (_req, res) =>
		res.status(200).json({ message: "I'm alive" })
	)
	// User base uri
	.use("/user", UserEndpointLimiter, userRouter)
	// Vault base uri
	.use("/vault", authenticate, vaultRoute)
	// for github Passport oauth
	.use("/github", githubRouter)
