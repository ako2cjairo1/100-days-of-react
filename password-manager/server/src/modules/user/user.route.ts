import express from "express"
import { authenticate } from "../../middlewares"
import { loginHandler, logoutHandler, registerHandler } from "./controllers"

export const userRouter = express
	.Router()
	.post("/registration", registerHandler)
	.post("/login", loginHandler)
	.post("/logout", authenticate, logoutHandler)
