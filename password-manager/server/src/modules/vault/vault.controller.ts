import { NextFunction } from "express"
import type { IReqExt, IResExt } from "../../type"
import type { IUpdateVault, IUserModel } from "@shared"
import { CreateError, Logger } from "../../utils"
import { updateVaultByUserId } from "./vault.service"

export async function updateVaultHandler(
	req: IReqExt<IUpdateVault>,
	res: IResExt<IUserModel>,
	next: NextFunction
) {
	const user = res.user
	try {
		// check if user session is authenticated
		if (!user) {
			return res
				.status(400)
				.json({ message: "Update could not be completed." })
		}

		await updateVaultByUserId({
			userId: user.userId,
			data: req.body.encryptedVault,
		})

		return res.status(200).json({ message: "Vault Updated!" })
	} catch (err) {
		// parse unknown err
		let error = CreateError(err)
		// default error message
		error.message = "Error updating Vault :("
		// send formatted error to error handler plugin
		next(error)
	} finally {
		Logger.info({
			action: "VAULT UPDATE",
			userId: user?.userId,
			email: user?.email,
		})
	}
}
