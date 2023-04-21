import fs from "fs"
import path from "path"
import crypto from "crypto"
import argon2 from "argon2"
import * as jwt from "jsonwebtoken"
import { Request } from "express"

// generate salt
export function generateSalt() {
	return crypto.randomBytes(64).toString("hex")
}

export async function generateHash(password: string) {
	return argon2.hash(password)
}

export async function isHashVerified(verifier: string, plain: string) {
	const hash = await generateHash(plain)
	return argon2.verify(verifier, hash)
}

// extract jwt from request
export function extractJWT(req: Request) {
	const { authorization } = req.headers

	if (authorization && authorization.toLowerCase().includes("bearer ")) {
		return authorization.split(" ")[1]?.toString()
	}

	if (req.query && req.query.token) {
		return req.query.token.toString()
	}
}

export function jwtSign<T extends {} | string | Buffer>(payload: T) {
	const publicKey = fs.readFileSync(
		`${(path.join(process.cwd()), "certs")}/private.key`
	)
	return jwt.sign(payload, publicKey, { algorithm: "HS256" })
}
