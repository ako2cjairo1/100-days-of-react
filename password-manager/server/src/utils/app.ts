import env from "dotenv"
import express from "express"
import cors from "cors"
import { ApiLogger } from "./logger"
import { rootRouter } from "../routes/rootRoute"
import { userRouter } from "../modules/user/user.route"
import { customErrorPlugin, jwtPlugin } from "../plugins"

env.config()
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173"

export const app = express()

/* Register plugins here */
app.use(ApiLogger)
// cors
app.use(
	cors({
		origin: CORS_ORIGIN,
		credentials: true,
	})
)
// jason web token
app.use(jwtPlugin)
// json parser
app.use(express.json())

/* Routes */
app.use(rootRouter)
app.use(userRouter)
// TODO:  app.use(vaultRouter)

/* Error Handler */
app.use(customErrorPlugin)
