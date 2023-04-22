import { SHA256, PBKDF2, AES, enc } from 'crypto-js'

export function hashPassword(password: string) {
	return SHA256(password).toString()
}

type IGenerateVaultKey = {
	email: string
	hashedPassword: string
	salt: string
}
export function generateVaultKey({ email, hashedPassword, salt }: IGenerateVaultKey) {
	return PBKDF2(`${email}:${hashedPassword}`, salt, {
		keySize: 32,
	}).toString()
}

interface IEncryptVault {
	vaultKey: string
	vault: string
}
export function encryptVault({ vault, vaultKey }: IEncryptVault) {
	return AES.encrypt(vault, vaultKey).toString()
}

export function decryptVault({ vault, vaultKey }: IEncryptVault) {
	const bytes = AES.decrypt(vault, vaultKey)
	const decrypted = bytes.toString(enc.Utf8)

	try {
		return JSON.parse(decrypted).vault
	} catch (err) {
		return null
	}
}
