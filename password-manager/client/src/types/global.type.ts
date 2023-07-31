import { RequestType, PasswordStatus, FormContent } from '@/services/constants'
import type { TConvertToStringUnion } from '@/types'
import { TCredentials } from '@shared'

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

export type TExportKeychain = Pick<TKeychain, 'website' | 'username' | 'password'>

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

export type TAuthProvider = {
	email: string
	vault: string
	vaultKey: string
	accessToken: string
	isLoggedIn: boolean
}

export type TAuthContext<T> = {
	authInfo: T
	mutateAuth: TFunction<[authInfo: Partial<T>], void>
	authenticate: TFunction<[credential?: TCredentials], Promise<TStatus>>
}

export type TFunction<T = [], RT = void> = T extends unknown[]
	? (...params: T) => RT
	: T extends true | false
	? (param: boolean) => RT
	: (param: T) => RT

export type TRequestType = TConvertToStringUnion<typeof RequestType>

export type TVaultContent = TConvertToStringUnion<typeof FormContent>
