import express from "express"
import { registerUserHandler } from "./user.controller"

export const userRouter = express.Router()

userRouter.post("/api/users", registerUserHandler)
