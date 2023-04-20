import { TVault } from "@/types/Vault.type"
import { VaultModel } from "./vault.model"

export function createVault(vault: TVault) {
	return VaultModel.create(vault)
}
