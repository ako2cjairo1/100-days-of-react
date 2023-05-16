import express from "express"
import {
	facebookPassport,
	ssoAuthorizationHandler,
	githubPassport,
	googlePassport,
} from "../sso"

export const ssoRoute = express
	.Router()
	// sso sign-in gateway for all providers
	.get("/sso", ssoAuthorizationHandler)
	// callback routes, should be registered to sso provider(s)
	.get("/callback/github", githubPassport)
	.get("/callback/google", googlePassport)
	.get("/callback/facebook", facebookPassport)
