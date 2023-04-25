import { TUser } from "../../types"
import { UserModel } from "./user.model"
import { isHashVerified } from "../../utils"

// create user
export async function createUser(user: TUser) {
	return UserModel.create(user)
}

export async function authenticateByEmailAndPassword({
	email,
	password,
}: TUser) {
	const user = await UserModel.findOne({ email })

	// return user info if found and password hash is verified
	if (user && (await isHashVerified(user.password, password))) return user

	// otherwise, return nothing
	return null
}

export async function deleteUserById(userId: string) {
	return await UserModel.findOneAndDelete({ _id: userId })
}
