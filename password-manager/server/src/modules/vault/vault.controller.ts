import { NextFunction, Request, Response } from "express"
import { TVault } from "../../types"
import { CreateError, Logger } from "../../utils"
import { updateVaultByUserId } from "./vault.service"

export async function updateVaultHandler(
	req: Request,
	res: Response,
	next: NextFunction
) {
	try {
		// parse Vault updates from request body
		const vault: TVault = {
			userId: req.body.userId,
			data: req.body.data,
		}
		//TODO: authenticate user before updating the vault
		await updateVaultByUserId(vault)

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
