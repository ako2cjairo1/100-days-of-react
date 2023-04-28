import { TVault } from "../../types"
import { VaultModel } from "./vault.model"

export async function createVault(vault: TVault) {
	return VaultModel.create(vault)
}

export async function updateVaultByUserId({ userId, data }: TVault) {
	return await VaultModel.updateOne({ userId }, { data })
}

export async function getVaultByUserId(userId: string) {
	return await VaultModel.findOne({ userId: userId })
}

export async function deleteVaultByUserId(userId: string) {
	return await VaultModel.findOneAndDelete({ userId })
}
