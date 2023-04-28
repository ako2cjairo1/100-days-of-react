import crypto from "crypto"
import argon2 from "argon2"
import * as jwt from "jsonwebtoken"
import { CookieOptions, Request, Response } from "express"
import {
	Cookies,
	DefaultCookieOptions,
	ParameterStore,
	TokenExpiration,
	TokenType,
} from "../constant"
import { CreateError, Logger } from "../utils"

export function generateSalt() {
	return crypto.randomBytes(64).toString("hex")
}

export async function generateHash(plain: string) {
	return argon2.hash(plain)
}

export async function isHashVerified(verifier: string, plain: string) {
	return argon2.verify(verifier, plain)
}

export interface IParseToken {
	accessToken?: string
	refreshToken?: string
}
// extract jwt from request
export function parseToken(req: Request): IParseToken {
	const { cookies, query } = req
	let parsedTokens: IParseToken = {}

	// parse cookies for cookies
	if (cookies) {
		Logger.warn("Parsing Cookies for Tokens")
		parsedTokens = {
			accessToken: cookies[Cookies.AccessToken],
			refreshToken: cookies[Cookies.RefreshToken],
		}
	}

	// parse query string
	const accessTokenParam = query[Cookies.AccessToken]
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

export interface ITokenPayload {
	userId: string
	email: string
	version?: number
}
export interface IVerifiedToken {
	userId: string
	email: string
	version?: number
	exp: number
}

export interface ISignOptions {
	secretOrPrivateKey: jwt.Secret
	expiresIn: string | number
}
export function signToken(
	payload: ITokenPayload,
	{ secretOrPrivateKey, expiresIn }: ISignOptions
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
	token?: IVerifiedToken
	isVerified: boolean
} {
	try {
		const secret =
			type === TokenType.Access
				? ParameterStore.ACCESS_TOKEN_SECRET
				: ParameterStore.REFRESH_TOKEN_SECRET
		const token = jwt.verify(payload, secret) as IVerifiedToken
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

export function buildTokens({ userId, email, version }: ITokenPayload) {
	return {
		accessToken: signToken(
			{ userId, email },
			{
				expiresIn: TokenExpiration.Access,
				secretOrPrivateKey: ParameterStore.ACCESS_TOKEN_SECRET,
			}
		),
		refreshToken: version
			? signToken(
					{ userId, email, version },
					{
						expiresIn: TokenExpiration.Refresh,
						secretOrPrivateKey: ParameterStore.REFRESH_TOKEN_SECRET,
					}
			  )
			: "",
	}
}

const accessTokenCookieOptions: CookieOptions = {
	...DefaultCookieOptions,
	maxAge: TokenExpiration.Access * 1000,
}
const refreshTokenCookieOptions: CookieOptions = {
	...DefaultCookieOptions,
	maxAge: TokenExpiration.Refresh * 1000,
}

interface ISetCookies {
	accessToken: string
	refreshToken?: string
}

export function setCookies(
	res: Response,
	{ accessToken, refreshToken }: ISetCookies
) {
	try {
		res.cookie(Cookies.AccessToken, accessToken, accessTokenCookieOptions)
		if (refreshToken)
			res.cookie(
				Cookies.RefreshToken,
				refreshToken,
				refreshTokenCookieOptions
			)
	} catch (error) {
		let err = CreateError(error)
		err.name = "Set Cookies Error"
		Logger.error(err)
	}
}

export function removeCookies(res: Response) {
	try {
		const options: CookieOptions = { ...DefaultCookieOptions, maxAge: 0 }
		res.clearCookie(Cookies.AccessToken, options)
		res.clearCookie(Cookies.RefreshToken, options)
	} catch (error) {
		let err = CreateError(error)
		err.name = "Remove Cookies Error"
		Logger.error(err)
	}
}
