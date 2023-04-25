import mongoose from "mongoose"
import argon2 from "argon2"
import { TUser } from "../../types"
import { generateHash } from "../../utils"

// create User schema
const UserSchema = new mongoose.Schema(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
	},
	{
		timestamps: true,
	}
)

// automatically hash the "password" when adding or updating a User
// !Note: password from client maybe hashed as well, but we'll hash it again anyway.
UserSchema.pre("save", async function (next) {
	const user = this
	if (user.isModified("password") || user.isNew) {
		user.password = await generateHash(user.password)
		return next()
	}
})

// create the User model and export
export const UserModel = mongoose.model<TUser>("User", UserSchema)
