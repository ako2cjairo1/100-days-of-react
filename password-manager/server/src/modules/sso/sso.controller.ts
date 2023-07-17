import { NextFunction, Request, Response } from "express"
import type { TProvider } from "@shared"
import {
	CreateError,
	Logger,
	FacebookOptions,
	GithubOptions,
	GoogleOptions,
	ParameterStore,
} from "../../utils"

const { GITHUB_SIGN_IN_URL, GOOGLE_SIGN_IN_URL, FACEBOOK_SIGN_IN_URL } =
	ParameterStore

const providerAuthURL = {
	github: `${GITHUB_SIGN_IN_URL}/authorize?${new URLSearchParams(
		GithubOptions
	).toString()}`,
	google: `${GOOGLE_SIGN_IN_URL}?${new URLSearchParams(
		GoogleOptions
	).toString()}`,
	facebook: `${FACEBOOK_SIGN_IN_URL}?${new URLSearchParams(
		FacebookOptions
	).toString()}`,
}

export async function ssoAuthorizationHandler(
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
