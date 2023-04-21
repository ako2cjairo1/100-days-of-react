import mongoose from "mongoose"

// create vault schema
const VaultSchema = new mongoose.Schema(
	{
		user: { type: String, required: true, unique: true },
		vault: { type: String, default: "" },
		salt: { type: String, required: true },
	},
	{
		timestamps: true,
	}
)

// create the vault model using the schema then export
export const VaultModel = mongoose.model("Vault", VaultSchema)
