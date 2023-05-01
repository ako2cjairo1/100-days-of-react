import env from "dotenv"
import { CookieOptions } from "express"
env.config()

const isProd = process.env.NODE_ENV === "production"
const SERVER_PORT = process.env.SERVER_PORT || 8080
const mongoDB_userName = process.env.MONGODB_USERNAME || ""
const mongoDB_password = process.env.MONGODB_PASSWORD || ""
const mongodb_database = process.env.MONGODB_DATABASE || ""
const MONGODB_URL = `mongodb+srv://${mongoDB_userName}:${mongoDB_password}@mern-ecommerce-cluster.jjpzu.mongodb.net/${mongodb_database}`

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173"
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || "localhost"
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || ""
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || ""
const SECRET_KEY = ACCESS_TOKEN_SECRET

export const ParameterStore = {
	SERVER_PORT,
	MONGODB_URL,
	CLIENT_URL,
	COOKIE_DOMAIN,
	SECRET_KEY,
	ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_SECRET,
}

export const TokenType = {
	Access: "Access",
	Refresh: "Refresh",
} as const

export const Cookies = {
	AccessToken: "PM_AT",
	RefreshToken: "PM_RT",
	User: "user",
} as const

export const TokenExpiration = {
	Access: 5 * 60, // 5 min
	Refresh: 7 * 24 * 60 * 60, // 7 days
} as const

export const DefaultCookieOptions: CookieOptions = {
	httpOnly: true, // set to "true" if we don't want want JS to read cookies
	secure: isProd ? true : false,
	sameSite: isProd ? "strict" : "lax",
	maxAge: 15 * 60 * 1000, // 15min default cookie expiration
	path: "/", // to let cookies be available to all pages of our app
	domain: COOKIE_DOMAIN,
}

export const RateLimitConfig = {
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	message:
		"Slow down! You're sending me too much requests. Please try again after sometime.",
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}

export const UserLimitConfig = {
	...RateLimitConfig,
	max: 20, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
	message: "Too many login attempts, please try again after sometime.",
}
