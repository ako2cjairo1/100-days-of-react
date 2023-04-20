import mongoose from "mongoose"
import { string } from "zod"

// create vault schema
const VaultSchema = new mongoose.Schema(
	{
		user: { type: string, required: true, unique: true },
		vault: { type: string, required: true },
		salt: { type: string, required: true },
	},
	{
		timestamps: true,
	}
)

// create the vault model using the schema then export
export const VaultModel = mongoose.model("vault", VaultSchema)
