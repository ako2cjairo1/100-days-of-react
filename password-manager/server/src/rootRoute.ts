import express from "express"
import { Logger, buildTokens, setCookies } from "./utils"
import { createUser } from "./modules"
import { ParameterStore } from "./constant"

const apiRoute = express.Router()

apiRoute.get("/heartbeat", (req, res) => {
	Logger.info("Just checking if server is up!")
	res.status(200).json({ message: "I'm alive" })
})

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

export { apiRoute }
