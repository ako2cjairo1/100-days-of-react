import { NextFunction, Request, Response } from "express"
import { CreateError } from "../../utils"
import { updateVaultByUserId } from "./vault.service"
import { Cookies } from "../../constant"

export async function updateVaultHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		// parse Vault updates from request body
		await updateVaultByUserId({
			userId: res.locals[Cookies.User].userId,
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
