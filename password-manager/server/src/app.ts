import express from "express"
import cors from "cors"
import { rootRouter } from "./rootRoute"
import { userRouter } from "./modules/user"
import {
	ActivityLogger,
	ApiHeaderRules,
	CookieParser,
	customErrorPlugin,
	JWTPlugin,
	NotFound,
	Security,
} from "./plugins"
import { ParameterStore } from "./constant"

const app = express()
app.use(
	cors({
		credentials: true,
		origin: ParameterStore.CLIENT_URL,
	})
)
// helmet, verify session cookies, rate limiter,
app.use(Security)
// using public key to sign
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
//* Register plugins here */
app.use(ApiHeaderRules)
app.use(CookieParser)
app.use(JWTPlugin)
// custom request logger
app.use(ActivityLogger)
//* Routes */
app.use(rootRouter)
app.use(userRouter)
// TODO: implement vault router
// app.use(vaultRouter)
//* custom Error Handler */
app.use(customErrorPlugin)
app.use(NotFound)

export { app }
