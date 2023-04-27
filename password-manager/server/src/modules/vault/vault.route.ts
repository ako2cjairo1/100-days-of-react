import express from "express"
import { updateVaultHandler } from "./vault.controller"
import { requireValidSession } from "../../middlewares/requireValidSession.plugin"

const vaultRoute = express.Router()

vaultRoute.post("/", requireValidSession, updateVaultHandler)

export { vaultRoute }
