import mongoose from "mongoose"
import { TVault } from "../../type"
import { generateSalt } from "../../utils"

// create vault schema
const VaultSchema = new mongoose.Schema(
	{
		userId: { type: String, required: true, unique: true },
		data: { type: String, default: "" },
		salt: { type: String },
	},
	{
		timestamps: true,
	}
)

VaultSchema.pre("save", async function (next) {
	if (this.isNew) {
		this.salt = generateSalt()
		return next()
	}
})

// create the vault model using the schema then export
export const VaultModel = mongoose.model<TVault>("Vault", VaultSchema)
