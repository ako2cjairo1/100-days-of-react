import { Response } from "express"
import { CreateError, Logger, removeCookies } from "../../../utils"
import { deleteUserById } from "../user.service"
import { deleteVaultByUserId } from "../../vault"

export async function rollbackRegistrationActions(
	res: Response,
	userId?: string
) {
	try {
		removeCookies(res)
		if (userId) {
			/* DB transactions to delete User and their Vault */
			await deleteUserById(userId)
			await deleteVaultByUserId(userId)
		}
	} catch (err) {
		const error = CreateError(err)
		error.name = "Rollback Registration Error"
		Logger.warn(error)
	}
}
