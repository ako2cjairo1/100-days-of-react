import env from "dotenv"
import express from "express"
import cors from "cors"

import { rootRouter } from "./rootRoute"
import { userRouter } from "./modules/user"
import {
	ActivityLogger,
	CookieParser,
	customErrorPlugin,
	jwtPlugin,
} from "./plugins"

env.config()
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173"
const app = express()

//* Register plugins here */
app.use(ActivityLogger)
app.use(
	cors({
		origin: CORS_ORIGIN,
		credentials: true,
	})
)
// using public key to sign
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(CookieParser)
app.use(jwtPlugin)

//* Routes */
app.use(rootRouter)
app.use(userRouter)
// TODO:  app.use(vaultRouter)

//* Error Handler */
app.use(customErrorPlugin)

export { app }
