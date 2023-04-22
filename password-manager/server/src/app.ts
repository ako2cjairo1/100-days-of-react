import env from "dotenv"
import express from "express"
import cors from "cors"
import { rootRouter } from "./rootRoute"
import { userRouter } from "./modules/user"
import { Security } from "./plugins/Security.plugin"
import {
	ActivityLogger,
	CookieParser,
	customErrorPlugin,
	jwtPlugin,
} from "./plugins"

env.config()
const CORS_ORIGIN = process.env.CORS_ORIGIN
const app = express()

//* Register plugins here */
// helmet, verify session cookies, rate limiter,
app.use(Security)
app.use(
	cors({
		origin: CORS_ORIGIN,
		credentials: true,
	})
)
// custom request logger
app.use(ActivityLogger)
// using public key to sign
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(CookieParser)
app.use(jwtPlugin)

//* Routes */
app.use(rootRouter)
app.use(userRouter)
// TODO: implement vault router
// app.use(vaultRouter)

//* custom Error Handler */
app.use(customErrorPlugin)

export { app }
