import type { TProvider } from "../../../../shared/types.shared"
import { ParameterStore } from "../../constant"
import { CreateError } from "../../utils"
import { NextFunction, Request, Response } from "express"

const {
	GITHUB_CLIENT_ID,
	GITHUB_REDIRECT_AUTH_URL,
	GOOGLE_REDIRECT_AUTH_URL,
	GOOGLE_CLIENT_ID,
	GOOGLE_SIGN_IN_URL,
} = ParameterStore

export async function getSignInUrl(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const provider = req.query["provider"]?.toString() as TProvider
		if (!provider) {
			return res.status(400).json({ message: "provider name is missing" })
		}

		switch (provider) {
			case "github":
				return res
					.status(200)
					.send(
						`${GITHUB_REDIRECT_AUTH_URL}/authorize?client_id=${GITHUB_CLIENT_ID}`
					)

			case "google":
				const options = {
					redirect_uri: GOOGLE_REDIRECT_AUTH_URL || "",
					client_id: GOOGLE_CLIENT_ID || "",
					access_type: "online",
					response_type: "code",
					prompt: "consent",
					scope: [
						"https://www.googleapis.com/auth/userinfo.profile",
						"https://www.googleapis.com/auth/userinfo.email",
					].join(" "),
				}

				return res
					.status(200)
					.send(
						`${GOOGLE_SIGN_IN_URL}?${new URLSearchParams(
							options
						).toString()}`
					)
			default:
				return res
					.status(400)
					.json({ message: "provider name not valid" })
		}
	} catch (err) {
		// parse unknown err
		let error = CreateError(err)
		// default error message
		error.message = "Sign-in Gateway Error"
		error.status = 400
		// send formatted error to error handler plugin
		return next(error)
	}
}
