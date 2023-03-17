import { PasswordStatus } from '@/services/constants'

export type TCredentials = {
	email: string
	password: string
	confirm?: string
}

export type TInputFocus = {
	[TKey in keyof TCredentials]: boolean
}

export type TStatus = Partial<{
	success: boolean
	errMsg: string
}>
export type TValidation = {
	isValidEmail: boolean
	isValidPassword: boolean
}
export type TPassword = {
	minLength: boolean
	alphabet: boolean
	number: boolean
	symbol: boolean
}
export type TPasswordEval = {
	password: string
	regex?: RegExp
}

export type RTPasswordEval = {
	status: (typeof PasswordStatus)[keyof typeof PasswordStatus]
	score: number
}

export type TAuthProvider = TCredentials & {
	accessToken: string
}

export type TAuthContext<T> = {
	auth: T
	setAuth: React.Dispatch<React.SetStateAction<T>>
}
