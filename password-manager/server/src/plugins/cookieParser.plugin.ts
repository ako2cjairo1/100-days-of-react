import fs from "fs"
import path from "path"
import cookieParser from "cookie-parser"

const publicKey = fs.readFileSync(
	`${(path.join(process.cwd()), "certs")}/public.key`
)
export const CookieParser = cookieParser(publicKey.toString())
