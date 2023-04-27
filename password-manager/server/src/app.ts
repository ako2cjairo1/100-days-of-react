import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import { ParameterStore } from "./constant"
import { apiRoute } from "./rootRoute"
import { userRouter } from "./modules/user"
import {
	activityLogger,
	headerRules,
	errorHandler,
	jwtPlugin,
	invalidRouteHandler,
	securities,
	deserializeSession,
} from "./middlewares"
import { vaultRoute } from "./modules"

const app = express()
app.use(
	cors({
		credentials: true,
		// to whitelist our own client app
		origin: ParameterStore.CLIENT_URL,
	})
)
/* middlewares: helmet, verify session cookies, rate limiter */
app.use(securities)
app.use(express.json())
// handle urlencoded form data
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

/* Register plugins here */
app.use(headerRules)
app.use(jwtPlugin)
app.use(activityLogger)

/* Routes */
app.use("/api/v1", apiRoute)
app.use(deserializeSession)
app.use("/api/v1/user", userRouter)
app.use("/api/v1/vault", vaultRoute)

/* custom Error Handler */
app.use(errorHandler, invalidRouteHandler)

export { app }
