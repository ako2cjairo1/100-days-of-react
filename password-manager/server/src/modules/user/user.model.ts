import mongoose from "mongoose"
import type { IUserModel } from "../../types"
import { generateHash, generateSalt } from "../../utils"

// create User schema
const UserSchema = new mongoose.Schema<IUserModel>(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		version: { type: String, default: "" },
		isLoggedIn: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	}
)

// automatically hash the "password" when adding or updating a User
// !Note: password from client maybe hashed as well, but we'll hash it again anyway.
UserSchema.pre("save", async function (next) {
	const { isNew, isModified, password } = this

	if (isNew || isModified("password")) {
		this.password = await generateHash(password)
	}
	if (isNew) {
		this.version = generateSalt(16)
	}
	return next()
})

// create the User model and export
export const UserModel = mongoose.model<IUserModel>("User", UserSchema)
