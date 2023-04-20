import mongoose from "mongoose"
import { string } from "zod"

// create User schema
const UserSchema = new mongoose.Schema(
	{
		email: { type: string, required: true, unique: true },
		masterPassword: { type: string, required: true },
	},
	{
		timestamps: true,
	}
)

// create the User model and export
export const UserModel = mongoose.model("users", UserSchema)
