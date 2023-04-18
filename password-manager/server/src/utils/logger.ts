import pino from "pino"

export const Logger = pino({
	transport: {
		target: "pino-pretty",
		options: {
			ignore: "hostname,pid",
			colorize: true,
		},
	},
})
