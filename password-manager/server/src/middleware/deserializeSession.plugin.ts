import { Request, NextFunction } from "express"
import {
	CreateError,
	buildTokens,
	parseToken,
	removeCookies,
	createCookies,
	verifyToken,
	Logger,
} from "../utils"
import { TokenType } from "../constant"
import { fetchUserById } from "../modules/user/controllers"
import { IResExt, TVerifiedToken } from "../type"

export async function deserializeSession(
	req: Request,
	res: IResExt<TVerifiedToken>,
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
				// set the verified access token to response
				res.user = token
				return next()
			}
		}

		// accessToke is expired, check the refreshToken
		if (refreshToken) {
			Logger.warn("Token Expired")
			// expired accessToken, check the refresh token
			const { isVerified, token } = verifyToken(
				refreshToken,
				TokenType.Refresh
			)
			if (isVerified && token) {
				// remove previously signed tokens (cookies)
				removeCookies(res)
				// fetch auth user to be signed
				const user = await fetchUserById(token.userId)

				// check if the token version is match
				if (token.version !== user?.version) {
					// TODO: implement a token rotation strategy
					Logger.error(
						`Possible token reuse detected. Access is revoked! ${token.userId} => [${token.version}]`
					)
					return next(null)
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
					// set the verified access token to response
					// expired accessToken, check the refresh token
					const { isVerified, token } = verifyToken(
						accessToken,
						TokenType.Access
					)
					Logger.info("New Access Token Created")
					if (isVerified && token) res.user = token
				}
			}
		}

		return next()
	} catch (err) {
		// unknown error, create custom error
		const error = CreateError(err)
		Logger.warn("Deserialize Error", error)
		// send formatted error to error handler plugin
		return next(error)
	}
}
