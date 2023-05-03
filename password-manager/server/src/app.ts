import express from "express"
import cookieParser from "cookie-parser"
import { rootRoute } from "./rootRoute"
import {
	activityLogger,
	errorHandler,
	invalidRouteHandler,
	securities,
	deserializeSession,
} from "./middleware"
import { ParameterStore } from "./constant"

const { SECRET_KEY, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = ParameterStore

export default express()
	/* middleware: cors, helmet, express-session (cookie parser), rate limiter */
	.use(securities)
	.use(express.json())

	// handle urlencoded form data
	.use(express.urlencoded({ extended: false }))
	.use(cookieParser([ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET, SECRET_KEY]))

	/* Register plugins here */
	.use(activityLogger)

	// middleware controller to parse tokens (cookies, authorization and query string)
	.use(deserializeSession)

	/* root route of API endpoint */
	.use("/api/v1", rootRoute)

	/* custom Error Handler */
	.use(errorHandler, invalidRouteHandler)
