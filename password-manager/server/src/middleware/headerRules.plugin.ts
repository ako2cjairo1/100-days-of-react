import { Request, Response, NextFunction } from "express"
import { ParameterStore } from "../constant"

export function headerRules(req: Request, res: Response, next: NextFunction) {
	// !This can be omitted, already handled by cors module
	// whitelist the target client url
	// res.header("Access-Control-Allow-Origin", ParameterStore.CLIENT_URL)

	// allowed headers
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	)

	if (req.method.toUpperCase() === "OPTIONS") {
		res.header(
			"Access-Control-Allow-Methods",
			"PUT, POST, PATCH, DELETE, GET"
		)
		return res.status(200).json({ message: "OK" })
	}

	next()
}
