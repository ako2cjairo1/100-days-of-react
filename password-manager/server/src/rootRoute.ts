import express from "express"
import { Logger, buildTokens } from "./utils"
import { createUser, userRouter, vaultRoute } from "./modules"
import { ParameterStore } from "./constant"
import {
	UserEndpointLimiter,
	authenticate,
	deserializeSession,
} from "./middleware"

export const rootRoute = express
	.Router()
	.get("/heartbeat", (req, res) => {
		Logger.info("Just checking if server is up!")
		res.status(200).json({ message: "I'm alive" })
	})
	// middleware controller to deserialize tokens (cookies, authorization and query string)
	.use(deserializeSession)
	// User base uri
	.use("/user", UserEndpointLimiter, userRouter)
	// Vault base uri
	.use("/vault", authenticate, vaultRoute)

// rootRouter.get("/github", (req, res) => {
// 	const { code } = req.query

// const githubUser = await getGitHubUser(code as string)
// let user = await getUserByGitHubId(githubUser.id)

// // register github user if not found database
// if(!user) user = await createUser({ email: githubUser.email, password: githubUser.id })

// const {accessToken, refreshToken} = buildTokens(user)
// setCookie({
// 	res,
// 	accessToken,
// 	refreshToken
// })
// 	res.redirect(`${ParameterStore.CLIENT_URL}/me`)
// })
