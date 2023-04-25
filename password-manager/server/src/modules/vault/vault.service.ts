import { TVault } from "../../types"
import { VaultModel } from "./vault.model"

export async function createVault(vault: TVault) {
	return VaultModel.create(vault)
}

export async function updateVaultByUserId({ userId, data }: TVault) {
	VaultModel.updateOne({ userId }, { data })
}

export async function getVaultByUserId(userId: string) {
	return VaultModel.findOne({ userId: userId })
}
