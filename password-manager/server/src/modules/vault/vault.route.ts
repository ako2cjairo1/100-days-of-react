import express from "express"
import { updateVaultHandler } from "./vault.controller"

const vaultRoute = express.Router()

vaultRoute.put("/api/session", updateVaultHandler)
