import { Request, Response, NextFunction } from "express"
import {
	CreateError,
	buildTokens,
	parseToken,
	removeCookies,
	createCookies,
	verifyToken,
} from "../utils"
import { Cookies, TokenType } from "../constant"
import { fetchUserById } from "../modules/user/controllers"

export async function deserializeSession(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		// parse cookies, query string and Bearer token
		const { accessToken, refreshToken } = parseToken(req)
		// if there are no tokens to deserialize, proceed to next
		if (!accessToken && !refreshToken) return next()

		// verify accessToken signature
		if (accessToken) {
			const { isVerified, token } = verifyToken(
				accessToken,
				TokenType.Access
			)
			if (isVerified && token) {
				// set the verified access token to response locals
				res.locals[Cookies.User] = token
				return next()
			}
		}

		// accessToke is expired, check the refreshToken
		if (refreshToken) {
			// expired accessToken, check the refresh token
			const { isVerified, token } = verifyToken(
				refreshToken,
				TokenType.Refresh
			)
			if (isVerified && token) {
				const user = await fetchUserById(token.userId)

				// TODO: implement a token rotation strategy
				// check if the token version is match
				if (token.version !== user?.version) {
					removeCookies(res)
					return next(new Error("Access Invalid (revoked)"))
				}

				if (user) {
					const { _id, email, version } = user
					// generate new set of tokens using verified User info
					const { accessToken, refreshToken } = buildTokens({
						email,
						userId: _id.toString(),
						// increment for refresh token validation
						version,
					})
					// create secure cookies with signed access and refresh tokens
					createCookies(res, { accessToken, refreshToken })
					// set the verified access token to response locals
					// expired accessToken, check the refresh token
					const { isVerified, token } = verifyToken(
						accessToken,
						TokenType.Access
					)
					if (isVerified && token) res.locals[Cookies.User] = token
					return next()
				}
			}

			// refreshToken not verified, remove tokens from cookies
			removeCookies(res)
			return next()
		}

		return next()
	} catch (err) {
		console.error(err)
		// send formatted error to error handler plugin
		return next(CreateError(err))
	}
}
