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
	// to whitelist our own client app
	origin: (origin, callback) => {
		if (allowedOrigins.includes(origin as string))
			return callback(null, true)

		return callback(new Error("Invalid origin (CORS)"))
	},
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
