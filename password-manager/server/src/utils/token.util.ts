import crypto from "crypto"
import argon2 from "argon2"
import * as jwt from "jsonwebtoken"
import { Request, Response } from "express"
import {
	Cookies,
	DefaultCookieOptions,
	ParameterStore,
	TokenExpiration,
	TokenType,
} from "../constant"
import { CreateError, Logger } from "../utils"
import type {
	TSignOptions,
	TToken,
	TTokenPayload,
	TVerifiedToken,
} from "../type"

const { AccessToken, RefreshToken } = Cookies
const { Access, Refresh } = TokenExpiration
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = ParameterStore

export function generateSalt(size: number = 64) {
	return crypto.randomBytes(size).toString("hex")
}

export async function generateHash(plain: string) {
	return await argon2.hash(plain)
}

export async function isHashVerified(verifier: string, plain: string) {
	return await argon2.verify(verifier, plain)
}

// extract jwt from request
export function parseToken(req: Request): TToken {
	const { cookies, query } = req
	let parsedTokens: TToken = {}

	// parse cookies for cookies
	if (cookies) {
		Logger.warn("Parsing Cookies for Tokens")
		parsedTokens = {
			accessToken: cookies[AccessToken],
			refreshToken: cookies[RefreshToken],
		}
	}

	// parse query string
	const accessTokenParam = query[AccessToken]
	if (query && accessTokenParam) {
		Logger.warn("Parsing Query String Tokens")
		parsedTokens = {
			...parsedTokens,
			accessToken: accessTokenParam.toString(),
		}
	}

	// parse Authorization header, make sure accessToken is in correct format
	const { authorization } = req.headers
	if (authorization && authorization.toLowerCase().includes("bearer ")) {
		Logger.warn("Parsing Bearer Tokens")
		// override accessToken from cookies and query string
		parsedTokens = {
			...parsedTokens,
			// extract accessToken from "Authorization" header
			accessToken: authorization.split(" ")[1]?.toString(),
		}
	}

	return parsedTokens
}

export function signToken(
	payload: TTokenPayload,
	{ secretOrPrivateKey, expiresIn }: TSignOptions
) {
	return jwt.sign(payload, secretOrPrivateKey, {
		algorithm: "HS512",
		expiresIn,
	})
}

export function verifyToken(
	payload: string,
	type: keyof typeof TokenType = TokenType.Access
): {
	token?: TVerifiedToken
	isVerified: boolean
} {
	try {
		const secret =
			type === TokenType.Access
				? ACCESS_TOKEN_SECRET
				: REFRESH_TOKEN_SECRET
		const token = jwt.verify(payload, secret) as TVerifiedToken
		// send the verified accessToken if there are no errors
		return {
			token,
			isVerified: true,
		}
	} catch (error) {
		Logger.warn(CreateError(error).message)
	}
	// return empty accessToken, otherwise
	return {
		token: undefined,
		isVerified: false,
	}
}

export function buildTokens({ userId, email, version }: TTokenPayload) {
	return {
		accessToken: signToken(
			{ userId, email },
			{
				expiresIn: Access,
				secretOrPrivateKey: ACCESS_TOKEN_SECRET,
			}
		),
		refreshToken: version
			? signToken(
					{ userId, email, version },
					{
						expiresIn: Refresh,
						secretOrPrivateKey: REFRESH_TOKEN_SECRET,
					}
			  )
			: "",
	}
}

export function createCookies(
	res: Response,
	{ accessToken, refreshToken }: TToken
) {
	try {
		res.cookie(AccessToken, accessToken, {
			...DefaultCookieOptions,
			maxAge: Access * 1000,
		})
		if (refreshToken)
			res.cookie(RefreshToken, refreshToken, {
				...DefaultCookieOptions,
				maxAge: Refresh * 1000,
			})
	} catch (error) {
		let err = CreateError(error)
		err.name = "Set Cookies Error"
		Logger.error(err)
	}
}

export function removeCookies(res: Response) {
	try {
		res.clearCookie(AccessToken, { ...DefaultCookieOptions, maxAge: 0 })
		res.clearCookie(RefreshToken, { ...DefaultCookieOptions, maxAge: 0 })
	} catch (error) {
		let err = CreateError(error)
		err.name = "Remove Cookies Error"
		Logger.error(err)
	}
}
