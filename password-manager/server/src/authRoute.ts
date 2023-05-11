import express from "express"
import {
	facebookPassport,
	getSSOProviderURL,
	githubPassport,
	googlePassport,
} from "./modules/sso"

export const authRoute = express
	.Router()
	// sso sign-in gateway for all providers
	.get("/sso", getSSOProviderURL)
	// callback routes should be registered to sso provider(s)
	.get("/github", githubPassport)
	.get("/google", googlePassport)
	.get("/facebook", facebookPassport)
