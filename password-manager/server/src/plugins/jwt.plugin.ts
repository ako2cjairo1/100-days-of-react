import { expressjwt as jwt } from "express-jwt"
import { ParameterStore } from "../constant"

export const JWTPlugin = jwt({
	algorithms: ["HS256"],
	credentialsRequired: false,
	secret: ParameterStore.SECRET,
})
