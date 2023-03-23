import { PasswordStatus } from '@/services/constants'
import { TConvertToStringUnion, TConvertKeysOf } from '@/types'

export type TCredentials = {
	email: string
	password: string
	confirm?: string
}

export type TStatus = Partial<{
	success: boolean
	errMsg: string
}>

export type TInputValidation = {
	isValidEmail: boolean
	isValidPassword: boolean
}

export type TValidation = {
	isValid: boolean
	message: string
}

export type TPassword = {
	minLength: boolean
	alphabet: boolean
	number: boolean
	symbol: boolean
}

export type TEvaluatedPassword = {
	status: TConvertToStringUnion<typeof PasswordStatus>
	score: number
}

export type TAuthProvider = TCredentials & {
	accessToken: string
}

export type TAuthContext<T> = {
	auth: T
	updateAuthCb: (authentication: T) => void
}
