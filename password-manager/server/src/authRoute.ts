import express from "express"
import {
	facebookPassport,
	ssoAuthorization,
	githubPassport,
	googlePassport,
} from "./modules/sso"

export const authRoute = express
	.Router()
	// sso sign-in gateway for all providers
	.get("/sso", ssoAuthorization)
	// callback routes, should be registered to sso provider(s)
	.get("/callback/github", githubPassport)
	.get("/callback/google", googlePassport)
	.get("/callback/facebook", facebookPassport)
