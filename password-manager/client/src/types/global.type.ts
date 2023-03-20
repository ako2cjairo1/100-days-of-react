import { PasswordStatus } from '@/services/constants'
import { TKeysToStringUnion, TMapKeyValuesOf } from '@/types'

export type TCredentials = {
	email: string
	password: string
	confirm?: string
}

export type TInputFocus = TMapKeyValuesOf<TCredentials, boolean>

export type TStatus = Partial<{
	success: boolean
	errMsg: string
}>

export type TValidInput = {
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

export type EvaluatedPassword = {
	status: TKeysToStringUnion<typeof PasswordStatus>
	score: number
}

export type TAuthProvider = TCredentials & {
	accessToken: string
}

export type TAuthContext<T> = {
	auth: T
	setAuth: React.Dispatch<React.SetStateAction<T>>
}
