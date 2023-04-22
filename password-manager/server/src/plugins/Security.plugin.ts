import fs from "fs"
import path from "path"
import * as helmet from "helmet"
import session from "express-session"
import limiter from "express-rate-limit"

const publicKey = fs
	.readFileSync(`${(path.join(process.cwd()), "certs")}/public.key`)
	.toString()

const SessionCookies = session({
	secret: publicKey,
	resave: false,
	saveUninitialized: false,
	cookie: {
		httpOnly: true,
		secure: true,
		// domain: "example.com",
		path: "/",
		// Cookie will expire in 1 hour from when it's generated
		expires: new Date(Date.now() + 60 * 60 * 1000),
	},
})

const ApiLimiter = limiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 10, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	message:
		"Slow down! You are sending me too much requests. Please try again after sometime.",
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

export const LoginLimiter = limiter({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	message: "Too many login attempts, please try again after sometime.",
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

// add all security plugins here
export const Security = [helmet.default(), SessionCookies, ApiLimiter]
