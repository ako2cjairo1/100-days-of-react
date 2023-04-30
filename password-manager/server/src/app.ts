import express from "express"
import cookieParser from "cookie-parser"
import { rootRoute } from "./rootRoute"
import {
	activityLogger,
	headerRules,
	errorHandler,
	jwtPlugin,
	invalidRouteHandler,
	securities,
	deserializeSession,
} from "./middleware"
import { ParameterStore } from "./constant"
const { SECRET_KEY, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = ParameterStore

const app = express()
/* middleware: cors, helmet, express-session (cookie parser), rate limiter */
app.use(securities)
app.use(express.json())
// handle urlencoded form data
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser([ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, SECRET_KEY]))

// middleware controller to deserialize tokens (cookies, authorization and query string)
app.use(deserializeSession)
/* Register plugins here */
app.use(headerRules)
// handles top-level encryption for JWTs
app.use(jwtPlugin)
app.use(activityLogger)

/* root route of API endpoint */
app.use("/api/v1", rootRoute)

/* custom Error Handler */
app.use(errorHandler, invalidRouteHandler)

export { app }
