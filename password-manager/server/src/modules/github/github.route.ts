import express from "express"
import { githubPassport } from "./github.controller"

export const githubRouter = express.Router().get("/", githubPassport)
