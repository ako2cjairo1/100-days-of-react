import mongoose from "mongoose"
import { TVault } from "../../types"

// create vault schema
const VaultSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true, unique: true },
		data: { type: String, default: "" },
		salt: { type: String, required: true },
	},
	{
		timestamps: true,
	}
)

// create the vault model using the schema then export
export const VaultModel = mongoose.model<TVault>("Vault", VaultSchema)
