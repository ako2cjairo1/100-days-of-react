export interface TSignOptions {
	secretOrPrivateKey:
		| string
		| Buffer
		| { key: string | Buffer; passphrase: string }
	expiresIn: string | number
}
