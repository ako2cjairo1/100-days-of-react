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

export function generateSalt() {
	return crypto.randomBytes(64).toString("hex")
}

export async function generateHash(plain: string) {
	return argon2.hash(plain)
}

export async function isHashVerified(verifier: string, plain: string) {
	return argon2.verify(verifier, plain)
}

// extract jwt from request
export function extractToken(req: Request, tokenName: string = "") {
	const { authorization } = req.headers

	// make sure that the JWT is in correct Header format
	if (authorization && authorization.toLowerCase().includes("bearer ")) {
		// extract the JWT from "Authorization" header
		return authorization.split(" ")[1]?.toString()
	}
	if (req.query && req.query.token) {
		return req.query.toString()
	}
	if (req.cookies) {
		return req.cookies[tokenName]
	}
}

export interface ITokenPayload {
	userId: string
	email: string
	version?: number
}
export function signAccessToken(payload: ITokenPayload) {
	return jwt.sign(payload, ParameterStore.SECRET, {
		algorithm: "HS256",
		expiresIn: TokenExpiration.Access,
	})
}

export function verifyAccessToken(token: string) {
	return jwt.verify(token, ParameterStore.SECRET)
}

export function buildTokens({ userId, email, version }: ITokenPayload) {
	return {
		accessToken: signAccessToken({ userId, email }),
		refreshToken: version
			? signAccessToken({ userId, email, version })
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

interface ICookie {
	res: Response
	accessToken: string
	refreshToken?: string
}

export function setCookie({ res, accessToken, refreshToken }: ICookie) {
	try {
		res.cookie(Cookies.AccessToken, accessToken, accessTokenCookieOptions)
		if (refreshToken)
			res.cookie(
				Cookies.RefreshToken,
				refreshToken,
				refreshTokenCookieOptions
			)
	} catch (error) {
		console.warn(error)
	}
}
