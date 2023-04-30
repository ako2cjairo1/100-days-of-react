import { expressjwt as jwt } from "express-jwt"
import { ParameterStore } from "../constant"

export const jwtPlugin = jwt({
	algorithms: ["HS512"],
	credentialsRequired: false,
	secret: ParameterStore.SECRET_KEY,
})
