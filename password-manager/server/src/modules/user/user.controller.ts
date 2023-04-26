import { NextFunction, Request, Response } from "express"
import {
	createUser,
	authenticateByEmailAndPassword,
	loginUserById,
	logoutUserByEmail,
} from "../user"
import { createVault, getVaultByUserId } from "../vault"
import {
	CreateError,
	buildTokens,
	generateSalt,
	removeCookies,
	setCookies,
	signToken,
	verifyAccessToken,
} from "../../utils"
import { TUser } from "../../types"
import { Cookies, TokenExpiration } from "../../constant"

export async function registerHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		// create user and generate user._id
		const newUser = await createUser({
			email: req.body.email,
			password: req.body.password,
		})

		// create Vault by referencing to user._id
		// and with initial vault data as blank value
		const { data, salt } = await createVault({
			userId: newUser._id.toString(),
			data: "",
			salt: generateSalt(), // use to generate vaultKey
		})

		// create access token using the created user
		const accessToken = signToken(
			{
				userId: newUser._id.toString(),
				email: newUser.email,
			},
			TokenExpiration.Access
		)

		// registration successful: send accessToken, vault and salt (to generate vault key)
		return res.status(201).json({ accessToken, vault: data, salt })
	} catch (err) {
		console.warn(err)
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
				.json({ message: "Invalid email or password." })
		}
		// convert user _id to string
		const userId = authenticatedUser._id.toString()
		// get user vault from db using userId
		const vault = await getVaultByUserId(userId)
		if (!vault) {
			return res
				.status(405) // method not allowed
				.json({ message: "We can't find your Vault" })
		}
		// create access token using authenticated user(_id, email, etc.)
		const { accessToken, refreshToken } = buildTokens({
			userId,
			email: authenticatedUser.email,
			version: 1,
		})
		// attach signed accessToken to cookie
		setCookies({ res, accessToken, refreshToken })
		// update user as loggedIn
		await loginUserById(userId)
		// login success: send accessToken, vault and salt (to generate vault key)
		return res.status(200).json({
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

export async function logoutHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		// remove tokens from session cookies
		removeCookies(res)
		// from "deserializeSession" middleware
		const { userId } = res.locals.accessToken
		// update session to database
		if (userId) await logoutUserByEmail(userId)
	} catch (err) {
		// parse unknown err
		let error = CreateError(err)
		// default error message
		error.message = "Error logging out"
		// send formatted error to error handler plugin
		next(error)
	}

	res.json({ success: true }).end()
}
