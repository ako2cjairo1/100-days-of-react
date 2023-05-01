import express from "express"
import { updateVaultHandler } from "./vault.controller"

export const vaultRoute = express.Router().post("/update", updateVaultHandler)
