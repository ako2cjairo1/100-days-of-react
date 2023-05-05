import { NextFunction, Request } from "express"
import { CreateError } from "../../utils"
import { getVaultByUserId, updateVaultByUserId } from "./vault.service"
import { IReqExt, IResExt, IUserModel } from "../../type"
import { IUpdateVault } from "@shared"

export async function updateVaultHandler(
	req: IReqExt<IUpdateVault>,
	res: IResExt<IUserModel>,
	next: NextFunction
) {
	try {
		// check if user session is authenticated
		if (!res.user) {
			return res
				.status(400)
				.json({ message: "Update could not be completed." })
		}

		await updateVaultByUserId({
			userId: res.user.userId,
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
	}
}
