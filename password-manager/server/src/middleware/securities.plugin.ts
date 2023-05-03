import cors from "cors"
import Helmet from "helmet"
import session from "express-session"
import limiter from "express-rate-limit"
import { UserLimitConfig, ParameterStore, RateLimitConfig } from "../constant"
import { DefaultCookieOptions } from "../constant"

const allowedOrigins = ParameterStore.CLIENT_URL.split(",")
const SessionCookies = session({
	secret: ParameterStore.SECRET_KEY,
	resave: false,
	saveUninitialized: false,
	cookie: DefaultCookieOptions,
})

const Cors = cors({
	credentials: true,
	origin: (origin, next) => {
		// allow access if origin is on the white-list
		if (allowedOrigins.includes(origin as string)) return next(null, true)
		// otherwise, don not allow
		return next(null)
	},
	methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
	optionsSuccessStatus: 200,
	allowedHeaders: [
		"Access-Control-Allow-Headers",
		"Access-Control-Allow-Origin",
		"Access-Control-Allow- Methods",
		"Origin",
		"withCredentials",
		"X-Requested-With",
		"Content-Type",
		"Accept",
		"Authorization",
	],
})

// custom rate limiter for login
export const UserEndpointLimiter = limiter(UserLimitConfig)

// add more security plugins here
export const securities = [
	Cors,
	Helmet(),
	SessionCookies,
	limiter(RateLimitConfig),
]
