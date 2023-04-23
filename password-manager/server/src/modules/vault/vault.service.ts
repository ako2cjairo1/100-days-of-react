import { TVault } from "../../types"
import { VaultModel } from "./vault.model"

export function createVault(vault: Pick<TVault, "user" | "salt">) {
	return VaultModel.create(vault)
}

interface IUpdateVault {
	userId: string
	data: string
}
export function updateVault({ userId, data }: IUpdateVault) {
	VaultModel.updateOne({ user: userId }, { data })
}
