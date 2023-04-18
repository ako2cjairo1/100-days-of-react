import env from "dotenv"
import fs from "fs"
import path from "path"
import express from "express"
import cors from "cors"
import bodyparser from "body-parser"
import { expressjwt as jwt } from "express-jwt"

env.config()
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:5173"
const publicKey = fs.readFileSync(
	`${(path.join(process.cwd()), "certs")}/public.key`
)

export const app = express()
/* Register plugins here */

// cors
app.use(
	cors({
		origin: CORS_ORIGIN,
		credentials: true,
	})
)
// jason web token
app.use(
	jwt({
		secret: publicKey,
		algorithms: ["RS256"],
		credentialsRequired: true,
	})
)
// json parser
app.use(bodyparser.json())
