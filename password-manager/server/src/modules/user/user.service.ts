import { UserModel } from "./user.model"
import { generateSalt, isHashVerified } from "../../utils"
import type { IUserModel, TCredentials } from "@shared"

// create user
export async function createUser(user: TCredentials) {
	return await UserModel.create(user)
}

export async function authenticateUser({ email, password }: TCredentials) {
	const user = await UserModel.findOne({ email })

	// return user info if found and password hash is verified
	if (user && (await isHashVerified(user.password, password))) return user

	// otherwise, return nothing
	return null
}

export async function deleteUserById(userId: IUserModel["userId"]) {
	return await UserModel.findOneAndDelete({ _id: userId })
}

export async function loginUserById(userId: IUserModel["userId"]) {
	return await UserModel.findOneAndUpdate(
		{ _id: userId },
		{ isLoggedIn: true }
	)
}

export async function logoutUserById(userId?: IUserModel["userId"]) {
	return await UserModel.findOneAndUpdate(
		{ _id: userId },
		{
			// replace old version to invalidate refreshToken issued
			version: generateSalt(16),
			isLoggedIn: false,
		}
	)
}

export async function getUserById(userId: IUserModel["userId"]) {
	return await UserModel.findOne({ _id: userId })
}

export async function getUserByEmail(email: IUserModel["email"]) {
	return await UserModel.findOne({ email })
}
