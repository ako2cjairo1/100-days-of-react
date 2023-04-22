import { Request, Response } from "express"
import { TVault } from "../../types"
import { CreateError, Logger } from "../../utils"
import { updateVault } from "./vault.service"

export async function updateVaultHandler(req: Request, res: Response) {
	const vault = req.body as TVault // TODO: create object validation for props

	try {
		const updateResult = await updateVault({
			userId: vault.user,
			data: vault.vault,
		})

		return res.status(200).send("Vault is updated!")
	} catch (err) {
		// parse unknown err
		const error = CreateError(err)
		// default error props
		let responseObj = {
			status: error.status,
			message: "Error updating vault",
			errorObj: err,
		}

		// extract error props for client
		const { status, message } = responseObj
		// server log custom error obj with readable message
		Logger.error(error, message)
		// respond with assigned response code (status) and formatted error
		return res.status(status).send({ status, message })
	}
}
