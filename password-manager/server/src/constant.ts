import env from "dotenv"
env.config()

const SERVER_PORT = process.env.SERVER_PORT || 8080
const MONGODB_USERNAME = process.env.MONGODB_USERNAME || ""
const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD || ""
const MONGODB_DATABASE = process.env.MONGODB_DATABASE || ""
const MongoDBUrl = `mongodb+srv://${MONGODB_USERNAME}:${MONGODB_PASSWORD}@mern-ecommerce-cluster.jjpzu.mongodb.net/${MONGODB_DATABASE}`

const CLIENT_URL = process.env.CLIENT_URL
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || "localhost"
const SECRET = process.env.SECRET || ""

export const ParameterStore = {
	SERVER_PORT,
	MONGODB_USERNAME,
	MONGODB_PASSWORD,
	MONGODB_DATABASE,
	MongoDBUrl,
	CLIENT_URL,
	COOKIE_DOMAIN,
	SECRET,
}

export const Cookies = {
	AccessToken: "PM_AT",
	RefreshToken: "PM_RT",
} as const

export const TokenExpiration = {
	Access: 5 * 60, // 5 mins
	Refresh: 7 * 24 * 60 * 60, // a week
} as const
