import express from "express"
import { loginHandler, registerHandler, logoutHandler } from "./user.controller"
import { AuthMiddleware, LoginLimiter } from "../../plugins"

export const userRouter = express.Router()
userRouter.post("/api/users", registerHandler)

userRouter.post("/api/users/login", LoginLimiter, loginHandler)
userRouter.post("/api/users/logout", AuthMiddleware, logoutHandler)
