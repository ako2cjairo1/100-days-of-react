import type { TCredentials } from "./types.shared"

export interface IUserModel extends TCredentials {
	userId: string
	version?: string
	isLoggedIn?: boolean
	exp?: number
}
export interface IUpdateVault {
	encryptedVault: string
	accessToken?: string
}

export interface ISession extends IUpdateVault {
	email: string
	hashedPassword: string
	salt: string
}
