import { Request, Response, NextFunction } from "express"
import { ParameterStore } from "../constant"

export function ApiHeaderRules(
	req: Request,
	res: Response,
	next: NextFunction
) {
	res.header("Access-Control-Allow-Origin", ParameterStore.CLIENT_URL)
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	)

	if (req.method === "OPTIONS") {
		res.header(
			"Access-Control-Allow-Methods",
			"PUT, POST, PATCH, DELETE, GET"
		)
		return res.status(200).send({ message: "Ok" })
	}

	next()
}
