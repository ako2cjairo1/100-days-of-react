import { TUser } from "@/types"
import { UserModel } from "./user.model"
import { isHashVerified } from "../../utils"

// create user
export async function createUser(user: TUser) {
	return UserModel.create(user)
}

export async function findUserByEmailAndPassword({
	email,
	masterPassword,
}: TUser) {
	const user = await UserModel.findOne({ email })
	// return nothing if user not found or master password is not verified
	if (!user || !isHashVerified(user.masterPassword, masterPassword))
		return null
	// otherwise, return found User from database
	return user
}
