import express from "express"
import { LoginLimiter, authenticate } from "../../middleware"
import {
	loginHandler,
	logoutHandler,
	registerHandler,
	sessionHandler,
} from "./controllers"

export const userRouter = express
	.Router()
	.post("/registration", registerHandler)
	.post("/login", LoginLimiter, loginHandler)
	.post("/logout", authenticate, logoutHandler)
	.post("/session", authenticate, sessionHandler)
