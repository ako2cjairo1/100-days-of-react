import express from "express"
import cookieParser from "cookie-parser"
import { apiRoute } from "./apiRoute"
import {
	securities,
	activityLogger,
	deserializeSession,
	errorHandler,
	invalidRouteHandler,
} from "./middleware"
import { authRoute } from "./authRoute"

export default express()
	/**
	 * --------------- BASE MIDDLEWARE -----------------
	 */
	.use(express.json())
	// Middleware that allows Express to parse through both JSON and x-www-form-urlencoded request bodies
	.use(express.urlencoded({ extended: false }))
	.use(cookieParser())
	/**
	 * -------------- CUSTOM MIDDLEWARE ----------------
	 */
	// middleware: cors, helmet, and default rate limiter
	.use(securities)
	// custom server activity logger (info, warn, error)
	.use(activityLogger)
	// to parse tokens (cookies, authorization and query string)
	.use(deserializeSession)
	/**
	 * -------------------- ROUTES ---------------------
	 */
	// Root router when you visit http://localhost:3000/api/v1, you will see "Login Page"
	// endpoints: /heartbeat, /user and /vault
	.use("/api/v1", apiRoute)
	// Root router when you visit (http://localhost:3000/auth)
	// endpoints: /sso, /callback:(google,github and facebook)
	.use("/auth", authRoute)

	// Middleware Error Handler: needs to be the last to handle api errors
	.use(errorHandler, invalidRouteHandler)
