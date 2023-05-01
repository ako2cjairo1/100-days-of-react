import { Request, Response, NextFunction } from "express"

export function headerRules(req: Request, res: Response, next: NextFunction) {
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
