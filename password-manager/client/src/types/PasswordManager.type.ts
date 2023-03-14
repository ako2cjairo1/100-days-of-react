import { SetStateAction } from 'react'

export type TCredentials = {
	username: string
	password: string
	confirm?: string
}

export type TStatus = Partial<{
	success: boolean
	errMsg: string
}>
export type TValidation = {
	username: boolean
	password: boolean
}
export type TPassword = {
	minLength: boolean
	alphabet: boolean
	number: boolean
	symbol: boolean
}

export type TAuthProvider = TCredentials & {
	accessToken: string
}

export type TAuthContext<T> = {
	auth: T
	setAuth: React.Dispatch<React.SetStateAction<T>>
}
