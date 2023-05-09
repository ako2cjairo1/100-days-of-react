import express from "express"
import { getSignInUrl, githubPassport, googlePassport } from "./modules/auth"

export const authRoute = express
	.Router()
	// sso sign-in gateway for all providers
	.get("/sso", getSignInUrl)
	// callback routes should be registered to sso provider(s)
	.get("/github", githubPassport)
	.get("/google", googlePassport)
