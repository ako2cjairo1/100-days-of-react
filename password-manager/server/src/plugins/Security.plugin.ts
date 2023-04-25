import Helmet from "helmet"
import session from "express-session"
import limiter from "express-rate-limit"
import { ParameterStore } from "../constant"

const SessionCookies = session({
	secret: ParameterStore.SECRET,
	resave: false,
	saveUninitialized: false,
	cookie: {
		domain: ParameterStore.COOKIE_DOMAIN,
		path: "/",
		secure: true,
		httpOnly: true,
		sameSite: true,
		signed: true,
		// Cookie will expire in 1 hour from when it's generated
		// expires: new Date(Date.now() + 60 * 60 * 1000),
	},
})

const limiterConfig = {
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	message:
		"Slow down! You're sending me too much requests. Please try again after sometime.",
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}

export const LoginLimiter = limiter({
	...limiterConfig,
	max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	message: "Too many login attempts, please try again after sometime.",
})

const ApiLimiter = limiter(limiterConfig)

// add more security plugins here
export const Security = [Helmet(), SessionCookies, ApiLimiter]
