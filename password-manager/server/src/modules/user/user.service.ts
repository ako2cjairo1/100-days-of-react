import { Request } from "express"
import crypto from "crypto"
import { TUser } from "@/types/User.type"
import { UserModel } from "./user.model"

// generate salt
export function generateSalt() {
	return crypto.randomBytes(64).toString("hex")
}

// create user
export async function createUser(user: TUser) {
	return UserModel.create(user)
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
