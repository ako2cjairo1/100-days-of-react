import { TCredentials } from "@shared"

export interface IUserModel extends TCredentials {
	userId: string
	version?: string
	isLoggedIn?: boolean
	exp?: number
}

export interface TSignOptions {
	secretOrPrivateKey:
		| string
		| Buffer
		| { key: string | Buffer; passphrase: string }
	expiresIn: string | number
}
