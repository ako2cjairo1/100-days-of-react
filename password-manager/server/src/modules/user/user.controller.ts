import { NextFunction, Request, Response } from "express"
import { createUser, authenticateByEmailAndPassword } from "../user"
import { createVault, getVaultByUserId } from "../vault"
import {
	CreateError,
	buildTokens,
	generateSalt,
	setCookie,
	signAccessToken,
} from "../../utils"
import { TUser } from "../../types"
import { Cookies } from "../../constant"

export async function registerHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		// map User info from request body
		const user: TUser = {
			email: req.body.email,
			password: req.body.password,
		}
		// create user and generate user._id
		const newUser = await createUser(user)

		// create Vault by referencing to user._id
		// salt: to generate vaultKey
		const salt = generateSalt()
		// and with initial vault data as blank value
		const vault = await createVault({
			userId: newUser._id.toString(),
			data: "",
			salt,
		})
		// create access token using the created user
		const accessToken = signAccessToken({
			userId: newUser._id.toString(),
			email: newUser.email,
		})
		// registration successful: send accessToken, vault and salt (to generate vault key)
		return res.status(201).send({ accessToken, vault, salt })
	} catch (err) {
		// parse unknown err
		let error = CreateError(err)
		// default error message
		error.message = "Error creating user"

		// override code:11000 as "Duplicate email" error
		if (error.code === 11000) {
			error.status = 409
			error.message = "email already exist"
		}
		// send formatted error to error handler plugin
		next(error)
	}
}

export async function loginHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		const userInfo: TUser = {
			email: req.body.email,
			password: req.body.password,
		}
		// find user and verify the hashed password
		const authenticatedUser = await authenticateByEmailAndPassword(userInfo)
		if (!authenticatedUser) {
			return res
				.status(401)
				.send({ message: "Invalid email or password." })
		}
		// convert user _id to string
		const userId = authenticatedUser._id.toString()
		// get user vault from db using userId
		const vault = await getVaultByUserId(userId)
		if (!vault) {
			return res
				.status(405) // method not allowed
				.send({ message: "We can't find your Vault" })
		}
		// create access token using authenticated user(_id, email, etc.)
		const { accessToken, refreshToken } = buildTokens({
			userId,
			email: authenticatedUser.email,
		})
		// attach signed accessToken to cookie
		setCookie({ res, accessToken, refreshToken })
		// login success: send accessToken, vault and salt (to generate vault key)
		return res.status(200).send({
			accessToken,
			vault: vault.data,
			salt: vault.salt,
		})
	} catch (err) {
		// parse unknown err
		let error = CreateError(err)
		// default error message
		error.message = "Access Denied!"
		error.status = 401
		// send formatted error to error handler plugin
		next(error)
	}
}

export async function logoutHandler(_req: Request, res: Response) {
	res.clearCookie(Cookies.AccessToken)
	res.clearCookie(Cookies.RefreshToken)
	res.end()
}
