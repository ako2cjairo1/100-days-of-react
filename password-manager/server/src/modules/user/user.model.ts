import mongoose from "mongoose"

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

// create the User model and export
export const UserModel = mongoose.model("User", UserSchema)
