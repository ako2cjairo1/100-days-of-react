import crypto from "crypto"
import argon2 from "argon2"
import * as jwt from "jsonwebtoken"
import { CookieOptions, Request, Response } from "express"
import {
	Cookies,
	DefaultCookieOptions,
	ParameterStore,
	TokenExpiration,
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
	let parsedTokens: IParseToken = {}

	// check for cookies
	if (req.cookies) {
		parsedTokens = {
			accessToken: req.cookies[Cookies.AccessToken],
			refreshToken: req.cookies[Cookies.RefreshToken],
		}
		Logger.warn("Parsing Cookies for Tokens")
	}

	// check query string
	if (req.query && req.query.token) {
		parsedTokens = {
			...parsedTokens,
			accessToken: req.query[Cookies.AccessToken]?.toString(),
		}
		Logger.warn("Parsing Query String Tokens")
	}

	const { authorization } = req.headers
	// make sure that the JWT is in correct Header format
	if (authorization && authorization.toLowerCase().includes("bearer ")) {
		// extract the JWT from "Authorization" header
		parsedTokens = {
			...parsedTokens,
			accessToken: authorization.split(" ")[1]?.toString(),
		}
		Logger.warn("Parsing Bearer Tokens")
	}

	return parsedTokens
}

export interface ITokenPayload {
	userId: string
	email: string
	version?: number
}
export function signToken(payload: ITokenPayload, expiresIn: string | number) {
	return jwt.sign(payload, ParameterStore.SECRET_KEY, {
		algorithm: "HS512",
		expiresIn,
	})
}

export interface IVerifiedToken {
	userId: string
	email: string
	version?: number
	exp: number
}
export function verifyToken(payload: string): {
	token?: IVerifiedToken
	isVerified: boolean
} {
	try {
		const token = jwt.verify(
			payload,
			ParameterStore.SECRET_KEY
		) as IVerifiedToken
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
		accessToken: signToken({ userId, email }, TokenExpiration.Access),
		refreshToken: version
			? signToken({ userId, email, version }, TokenExpiration.Refresh)
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
