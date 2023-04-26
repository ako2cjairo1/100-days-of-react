import express from "express"
import { loginHandler, registerHandler, logoutHandler } from "./user.controller"
import { deserializeSession, LoginLimiter } from "../../middlewares"

const userRouter = express.Router()

userRouter.post("/", registerHandler)
userRouter.post("/login", LoginLimiter, loginHandler)
userRouter.post("/logout", logoutHandler)

export { userRouter }
