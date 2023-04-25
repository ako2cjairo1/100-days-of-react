import crypto from "crypto"
import argon2 from "argon2"
import * as jwt from "jsonwebtoken"
import { Request } from "express"
import { ParameterStore, TokenExpiration } from "../constant"

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
export function extractJWT(req: Request) {
	const { authorization } = req.headers

	// make sure that the JWT is in correct Header format
	if (authorization && authorization.toLowerCase().includes("bearer ")) {
		// extract the JWT from "Authorization" header
		return authorization.split(" ")[1]?.toString()
	}

	if (req.query && req.query.token) {
		return req.query.token.toString()
	}
}

export function signAccessToken<T extends { userId: string; email: string }>(
	payload: T
) {
	return jwt.sign(payload, ParameterStore.SECRET, {
		algorithm: "HS256",
		expiresIn: TokenExpiration.Access,
	})
}
