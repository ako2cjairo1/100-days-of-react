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
} from "./middlewares"
import { ParameterStore } from "./constant"

const app = express()
/* middleware: cors, helmet, express-session (cookie parser), rate limiter */
app.use(securities)
app.use(express.json())
// handle urlencoded form data
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser(ParameterStore.SECRET_KEY))

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
