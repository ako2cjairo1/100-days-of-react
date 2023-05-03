import express from "express"
import { updateVaultHandler } from "./vault.controller"

export const vaultRoute = express.Router().patch("/update", updateVaultHandler)
