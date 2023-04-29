export type TUser = {
	email: string
	password: string
}

export interface IUserModel extends TUser {
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
