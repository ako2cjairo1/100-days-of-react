import cookieParser from "cookie-parser"
import { ParameterStore } from "../constant"

export const CookieParser = cookieParser(ParameterStore.SECRET)
