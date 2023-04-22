import express from "express"
import { registerUserHandler } from "./user.controller"
import { LoginLimiter } from "@/plugins/Security.plugin"

export const userRouter = express.Router()
userRouter.post("/api/users", registerUserHandler)

// TODO: implement loginUserHandler
// userRouter.post("/api/sessions", LoginLimiter, loginUserHandler)
