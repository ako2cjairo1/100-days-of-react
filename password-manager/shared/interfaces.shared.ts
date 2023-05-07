export interface IUpdateVault {
	encryptedVault: string
	accessToken?: string
}

export interface ISession extends IUpdateVault {
	email: string
	hashedPassword: string
	salt: string
}
