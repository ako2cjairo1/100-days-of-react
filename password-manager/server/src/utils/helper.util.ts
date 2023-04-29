import type { HTTPRequestError } from "../type"
/**
 * This function takes in an unknown error and returns an HTTPRequestError object.
 *
 * param {unknown} error - The error to be processed.
 * returns {HTTPRequestError} - The processed error object.
 */
export function CreateError(error: unknown) {
	let result: HTTPRequestError = {
		code: -1,
		status: 500,
		name: "An error has occurred.",
		message: "An unknown error occurred.",
		errorObj: error,
	}

	if (error instanceof Error) {
		// error is an instance of Error
		result.message = error.message
	}

	if (typeof error === "object" && error !== null) {
		// error is an object cast to interface with a name, message or code properties
		const unknownError = error as HTTPRequestError

		if (unknownError) {
			const { code, name, status, message } = unknownError
			result = {
				...result,
				code: code ? code : result.code,
				status: status ? status : result.status,
				name: name ? name : result.name,
				message: message ? message : result.message,
			}
		}
	} else {
		// error is not an instance of Error and does not have a message property
		console.warn(`${result} ${error}`)
	}

	return result
}
