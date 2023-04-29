type TResponseError = Error & {
	code: string | number
	status: number
	name: string
}
export type HTTPRequestError = TResponseError & {
	errorObj: Partial<TResponseError> | any
}
