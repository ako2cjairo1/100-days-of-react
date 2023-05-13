import type { TProvider } from "../../../../shared/types.shared"
import { ParameterStore } from "../../constant"
import { CreateError, Logger } from "../../utils"
import { NextFunction, Request, Response } from "express"

const {
	GITHUB_CLIENT_ID,
	GITHUB_SIGN_IN_URL,
	GITHUB_REDIRECT_AUTH_URL,
	GOOGLE_CLIENT_ID,
	GOOGLE_SIGN_IN_URL,
	GOOGLE_REDIRECT_AUTH_URL,
	FACEBOOK_CLIENT_ID,
	FACEBOOK_SIGN_IN_URL,
	FACEBOOK_REDIRECT_AUTH_URL,
} = ParameterStore

const googleOptions = {
	client_id: GOOGLE_CLIENT_ID,
	redirect_uri: GOOGLE_REDIRECT_AUTH_URL,
	access_type: "offline",
	response_type: "code",
	prompt: "consent",
	scope: [
		"https://www.googleapis.com/auth/userinfo.profile",
		"https://www.googleapis.com/auth/userinfo.email",
	].join(" "),
}
const facebookOptions = {
	client_id: FACEBOOK_CLIENT_ID,
	redirect_uri: FACEBOOK_REDIRECT_AUTH_URL,
	auth_type: "rerequest",
	response_type: "code",
	display: "popup",
	scope: ["public_profile", "email"].join(" "),
}
const githubOptions = {
	client_id: GITHUB_CLIENT_ID,
	redirect_uri: GITHUB_REDIRECT_AUTH_URL,
	scope: ["user", "email"].join(" "),
}

const providerAuthURL = {
	github: `${GITHUB_SIGN_IN_URL}/authorize?${new URLSearchParams(
		githubOptions
	).toString()}`,
	google: `${GOOGLE_SIGN_IN_URL}?${new URLSearchParams(
		googleOptions
	).toString()}`,
	facebook: `${FACEBOOK_SIGN_IN_URL}?${new URLSearchParams(
		facebookOptions
	).toString()}`,
}

export async function ssoAuthenticate(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const provider = req.query["provider"]?.toString() as TProvider
		const authURL = providerAuthURL[provider]
		if (!provider || !authURL) {
			return res.status(400).json({ message: "provider name is missing" })
		}

		return res.redirect(authURL)
	} catch (err) {
		Logger.error(err)
		// parse unknown err
		let error = CreateError(err)
		// default error message
		error.message = "SSO Gateway Error"
		error.status = 400
		// send formatted error to error handler plugin
		return next(error)
	}
}
