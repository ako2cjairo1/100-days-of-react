import { TVault } from "@/types/Vault.type"
import { VaultModel } from "./vault.model"

export function createVault(vault: Pick<TVault, "user" | "salt">) {
	return VaultModel.create(vault)
}
