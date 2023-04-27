import { NextFunction, Request, Response } from "express"
import {
	createUser,
	authenticateByEmailAndPassword,
	loginUserById,
	logoutUserByEmail,
	getUserById,
} from "../user"
import { createVault, getVaultByUserId } from "../vault"
import {
	CreateError,
	Logger,
	buildTokens,
	generateSalt,
	removeCookies,
	setCookies,
	signToken,
	verifyToken,
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

		if (authenticatedUser) {
			const { _id, email, version } = authenticatedUser
			const userId = _id.toString()

			// get user vault from db using userId
			const vault = await getVaultByUserId(userId)

			if (!vault) {
				return res
					.status(405) // method not allowed
					.json({ message: "We can't find your Vault" })
			}

			// generate pair of tokens using authenticated user(_Id, email, version, etc.)
			const { accessToken, refreshToken } = buildTokens({
				userId,
				email,
				// increment for refresh token validation
				version: (version || 0) + 1,
			})

			// store signed tokens into cookies
			setCookies(res, { accessToken, refreshToken })
			// update user as loggedIn (optional)
			await loginUserById(userId)

			const { data, salt } = vault
			// login success: send accessToken, vault data and salt (to generate vault key)
			return res.status(200).json({
				accessToken,
				vault: data,
				salt,
			})
		}

		throw Error("Login failed!")
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
		// from "deserializeSession" middleware
		const { userId } = res.locals[Cookies.AccessToken]
		Logger.error(userId)

		if (userId) {
			// remove tokens from session cookies
			// !IMP: client should also delete the cookies
			removeCookies(res)
			// update login status to database
			await logoutUserByEmail(userId)
		}
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

export async function fetchUserById(userId: string) {
	return await getUserById(userId)
}
