import mongoose from "mongoose"
import { IUserModel } from "../../types"
import { generateHash } from "../../utils"

// create User schema
const UserSchema = new mongoose.Schema<IUserModel>(
	{
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		isLoggedIn: { type: Boolean, default: false },
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
export const UserModel = mongoose.model<IUserModel>("User", UserSchema)
