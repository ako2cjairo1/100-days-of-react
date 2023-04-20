import express from "express"
import { registerUser } from "./user.controller"

export const userRouter = express.Router()
userRouter.post("/api/registration", registerUser)
