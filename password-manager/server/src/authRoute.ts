import express from "express"
import { githubPassport, googlePassport } from "./modules/auth"

export const authRoute = express
	.Router()
	.use("/callback/github", githubPassport)
	.use("/callback/google", googlePassport)
