import fs from "fs"
import path from "path"
import { expressjwt as jwt } from "express-jwt"

const privateKey = fs.readFileSync(
	`${(path.join(process.cwd()), "certs")}/private.key`
)
export const jwtPlugin = jwt({
	algorithms: ["HS256"],
	credentialsRequired: false,
	secret: privateKey,
})
