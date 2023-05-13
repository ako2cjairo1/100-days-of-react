import env from "dotenv"
import { CookieOptions } from "express"
env.config()

const isProd = process.env.NODE_ENV === "production"
const SERVER_PORT = process.env.SERVER_PORT || 8080
const SERVER_HOST =
	process.env.SERVER_HOST || `http://localhost:${SERVER_PORT}}`
const mongoDB_userName = process.env.MONGODB_USERNAME || ""
const mongoDB_password = process.env.MONGODB_PASSWORD || ""
const mongodb_database = process.env.MONGODB_DATABASE || ""
const MONGODB_URL = `mongodb+srv://${mongoDB_userName}:${mongoDB_password}@mern-ecommerce-cluster.jjpzu.mongodb.net/${mongodb_database}`

const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173"
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || "localhost"
const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || ""
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || ""
const SECRET_KEY = ACCESS_TOKEN_SECRET

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID || ""
const GITHUB_SECRET = process.env.GITHUB_SECRET || ""
const GITHUB_SIGN_IN_URL = process.env.GITHUB_SIGN_IN_URL || ""
const GITHUB_REDIRECT_AUTH_URL = process.env.GITHUB_REDIRECT_AUTH_URL || ""
const GITHUB_USER_API = process.env.GITHUB_USER_API || ""

const GOOGLE_ACCESS_TOKEN_URL = process.env.GOOGLE_ACCESS_TOKEN_URL || ""
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || ""
const GOOGLE_SIGN_IN_URL = process.env.GOOGLE_SIGN_IN_URL || ""

const GOOGLE_SECRET = process.env.GOOGLE_SECRET || ""
const GOOGLE_USER_API = process.env.GOOGLE_USER_API || ""
const GOOGLE_REDIRECT_AUTH_URL = process.env.GOOGLE_REDIRECT_AUTH_URL || ""

const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID || ""
const FACEBOOK_SECRET = process.env.FACEBOOK_SECRET || ""
const FACEBOOK_REDIRECT_AUTH_URL = process.env.FACEBOOK_REDIRECT_AUTH_URL || ""
const FACEBOOK_SIGN_IN_URL = process.env.FACEBOOK_SIGN_IN_URL || ""
const FACEBOOK_ACCESS_TOKEN_URL = process.env.FACEBOOK_ACCESS_TOKEN_URL || ""
const FACEBOOK_USER_API = process.env.FACEBOOK_USER_API || ""

// redirect to client url after successful oAuth
const clientURLEnvironment = CLIENT_URL.split(",")
const AUTH_CLIENT_REDIRECT_URL =
	(isProd ? clientURLEnvironment[1] : clientURLEnvironment[0]) || ""

export const ParameterStore = {
	SERVER_PORT,
	SERVER_HOST,
	MONGODB_URL,
	CLIENT_URL,
	COOKIE_DOMAIN,
	SECRET_KEY,
	ACCESS_TOKEN_SECRET,
	REFRESH_TOKEN_SECRET,
	GITHUB_REDIRECT_AUTH_URL,
	GITHUB_CLIENT_ID,
	GITHUB_SECRET,
	GITHUB_SIGN_IN_URL,
	GITHUB_USER_API,
	GOOGLE_CLIENT_ID,
	GOOGLE_SECRET,
	GOOGLE_SIGN_IN_URL,
	GOOGLE_REDIRECT_AUTH_URL,
	GOOGLE_ACCESS_TOKEN_URL,
	GOOGLE_USER_API,
	FACEBOOK_CLIENT_ID,
	FACEBOOK_SECRET,
	FACEBOOK_SIGN_IN_URL,
	FACEBOOK_REDIRECT_AUTH_URL,
	FACEBOOK_ACCESS_TOKEN_URL,
	FACEBOOK_USER_API,
	AUTH_CLIENT_REDIRECT_URL,
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

export const TokenMaxAge = {
	Access: 60, // 1 min
	Refresh: 5 * 60, // 5 mins
} as const

export const DefaultCookieOptions: CookieOptions = {
	domain: COOKIE_DOMAIN,
	path: "/", // to let cookies be available to all pages of our app
	secure: isProd ? true : false,
	httpOnly: isProd ? true : false, // set to "true" if we don't want want JS to read cookies
	sameSite: isProd ? "none" : "lax",
	maxAge: 5 * 60 * 1000, // 5min default cookie expiration
}

export const RateLimitConfig = {
	windowMs: 5 * 60 * 1000, // 5 minutes
	max: 100, // Limit each IP to 100 requests per `window` (per 5 minutes)
	message:
		"Slow down! You're sending me too much requests. Please try again after sometime.",
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers
}

export const UserLimitConfig = {
	...RateLimitConfig,
	max: 100, // Limit each IP to 100 requests per `window`
	message: "Too many login attempts, please try again after sometime.",
}
