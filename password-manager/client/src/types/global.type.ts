import { RequestType, PasswordStatus, VaultContent } from '@/services/constants'
import { TConvertToStringUnion } from '@/types'

export type TCredentials = {
	email: string
	password: string
}

export type TInputLogin = TCredentials & {
	isRemember: boolean
}

export type TInputRegistration = TCredentials & {
	confirm: string
	isTermsAgreed: boolean
}

export type TKeychain = {
	keychainId: string
	logo: string
	website: string
	username: string
	password: string
	timeAgo?: string
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
	mutateAuth: TFunction<[authInfo: Partial<T>], void>
}

export type TFunction<T = [], RT = void> = T extends unknown[]
	? (...params: T) => RT
	: T extends true | false
	? (param: boolean) => RT
	: (param: T) => RT

export type TRequestType = TConvertToStringUnion<typeof RequestType>

export type TVaultContent = TConvertToStringUnion<typeof VaultContent>
