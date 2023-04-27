import express from "express"
import { loginHandler, registerHandler, logoutHandler } from "./user.controller"
import { LoginLimiter } from "../../middlewares"
import { requireValidSession } from "../../middlewares/requireValidSession.plugin"

const userRouter = express.Router()

userRouter.post("/", registerHandler)
userRouter.post("/login", LoginLimiter, loginHandler)
userRouter.post("/logout", requireValidSession, logoutHandler)

export { userRouter }
