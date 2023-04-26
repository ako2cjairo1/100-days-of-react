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

// extract jwt from request
export function parseToken(
	req: Request,
	tokenName: string = Cookies.AccessToken
) {
	if (req.cookies) return req.cookies[tokenName]
	if (req.query && req.query.token) return req.query.toString()

	const { authorization } = req.headers
	// make sure that the JWT is in correct Header format
	if (authorization && authorization.toLowerCase().includes("bearer ")) {
		// extract the JWT from "Authorization" header
		return authorization.split(" ")[1]?.toString()
	}
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

export interface IAccessToken {
	userId: string
	email: string
	iat: number
	exp: number
}
export function verifyAccessToken(token: string) {
	try {
		const accessToken = jwt.verify(token, ParameterStore.SECRET_KEY)
		// send the verified accessToken if there are no errors
		return {
			accessToken,
			isVerified: true,
		}
	} catch (error) {
		Logger.warn(CreateError(error).message)
	}

	// return empty accessToken, otherwise
	return {
		accessToken: "",
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
	res: Response
	accessToken: string
	refreshToken?: string
}

export function setCookies({ res, accessToken, refreshToken }: ISetCookies) {
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
		res.cookie(Cookies.AccessToken, "", options)
		res.cookie(Cookies.RefreshToken, "", options)
	} catch (error) {
		let err = CreateError(error)
		err.name = "Remove Cookies Error"
		Logger.error(err)
	}
}
