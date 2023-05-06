import express from "express"
import cookieParser from "cookie-parser"
import { apiRoute } from "./apiRoute"
import {
	activityLogger,
	errorHandler,
	invalidRouteHandler,
	securities,
	deserializeSession,
} from "./middleware"
import { authRoute } from "./authRoute"

export default express()
	/* middleware: cors, helmet, and rate limiter */
	.use(securities)
	.use(express.json())
	// handle urlencoded form data
	.use(express.urlencoded({ extended: false }))
	.use(cookieParser())
	/* Register plugins here */
	.use(activityLogger)
	// middleware controller to parse tokens (cookies, authorization and query string)
	.use(deserializeSession)

	/* root route of API endpoint */
	.use("/api/v1", apiRoute)
	/* root route for oauth */
	.use("/auth", authRoute)

	/* custom Error Handler */
	.use(errorHandler, invalidRouteHandler)
