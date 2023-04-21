import env from "dotenv"
import express from "express"
import cors from "cors"

import { rootRouter } from "./rootRoute"
import { userRouter } from "./modules/user"
import { ActivityLogger, customErrorPlugin, jwtPlugin } from "./plugins"

env.config()
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173"
const app = express()

//* Register plugins here */
app.use(ActivityLogger)
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
app.use(express.urlencoded({ extended: false }))

//* Routes */
app.use(rootRouter)
app.use(userRouter)
// TODO:  app.use(vaultRouter)

//* Error Handler */
app.use(customErrorPlugin)

export { app }
