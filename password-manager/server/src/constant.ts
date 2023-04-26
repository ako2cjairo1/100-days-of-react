import env from "dotenv"
import { CookieOptions } from "express"
env.config()

const isProd = process.env.NODE_ENV === "production"
const SERVER_PORT = process.env.SERVER_PORT || 8080
const mongoDB_userName = process.env.MONGODB_USERNAME || ""
const mongoDB_password = process.env.MONGODB_PASSWORD || ""
const mongodb_database = process.env.MONGODB_DATABASE || ""
const MONGODB_URL = `mongodb+srv://${mongoDB_userName}:${mongoDB_password}@mern-ecommerce-cluster.jjpzu.mongodb.net/${mongodb_database}`

const CLIENT_URL = process.env.CLIENT_URL
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || "localhost"
const SECRET_KEY = process.env.SECRET || ""

export const ParameterStore = {
	SERVER_PORT,
	MONGODB_URL,
	CLIENT_URL,
	COOKIE_DOMAIN,
	SECRET_KEY,
}

export const Cookies = {
	AccessToken: "PM_AT",
	RefreshToken: "PM_RT",
} as const

export const TokenExpiration = {
	Access: 5 * 60, // 5 mins
	Refresh: 7 * 24 * 60 * 60, // a week
} as const

export const DefaultCookieOptions: CookieOptions = {
	httpOnly: isProd, // set to "true" if we don't want want JS to read cookies
	secure: isProd,
	sameSite: isProd ? "strict" : "lax",
	domain: COOKIE_DOMAIN,
	path: "/", // to let cookies be available to all pages of our app
	// signed: true,
}
