import { Request, Response, NextFunction } from "express"
import {
	CreateError,
	Logger,
	buildTokens,
	parseToken,
	removeCookies,
	setCookies,
	verifyToken,
} from "../utils"
import { fetchUserById } from "../modules"
import { Cookies } from "../constant"

export async function deserializeSession(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const { accessToken, refreshToken } = parseToken(req)
		// if there are no tokens to deserialize, proceed to next
		if (!accessToken && !refreshToken) return next()
		console.table({ accessToken, refreshToken })

		if (accessToken) {
			// verify accessToken signature
			const { isVerified, token } = verifyToken(accessToken)
			if (isVerified) {
				// set the verified access token to response locals
				res.locals[Cookies.AccessToken] = token
				return next()
			}
		}

		Logger.error("Token is expired")

		if (refreshToken) {
			// expired accessToken, check the refresh token
			const { isVerified, token } = verifyToken(refreshToken)
			if (isVerified && token) {
				const user = await fetchUserById(token.userId)

				if (user) {
					const { _id, email, version } = user
					// generate new set of tokens using verified User info
					const { accessToken, refreshToken } = buildTokens({
						email,
						userId: _id.toString(),
						// increment for refresh token validation
						version: (version || 0) + 1,
					})
					// attach signed accessToken to cookie
					setCookies(res, { accessToken, refreshToken })
					// set the verified access token to response locals
					res.locals[Cookies.AccessToken] = accessToken
					return next()
				}
			}

			// refreshToken not verified, remove tokens from cookies
			removeCookies(res)
			return next()
		}

		return next()
	} catch (err) {
		// send formatted error to error handler plugin
		return next(CreateError(err))
	}
}
