import express from "express"
import { loginHandler, registerHandler } from "./user.controller"
import { LoginLimiter } from "../../plugins"

export const userRouter = express.Router()
userRouter.post("/api/users", registerHandler)

userRouter.post("/api/users/login", LoginLimiter, loginHandler)
