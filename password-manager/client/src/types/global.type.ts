import { PasswordStatus } from '@/services/constants'
import { TConvertToStringUnion } from '@/types'

export type TCredentials = {
	email: string
	password: string
	confirm?: string
	isRemember?: boolean
	isTermsAgreed?: boolean
}

export type TKeychain = {
	keychainId: string
	logo?: string
	website: string
	username: string
	password: string
}

export type TStatus = {
	success: boolean
	message: string
}

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
	authInfo: T
	updateAuthInfo: (authInfo: T) => void
}

export type TFunction<T = Array<unknown>, RT = void> = T extends Array<
	unknown extends infer IT ? IT : T
>
	? (...params: T) => RT extends infer IRT ? IRT : RT
	: (param: T) => RT extends infer IRT ? IRT : RT
