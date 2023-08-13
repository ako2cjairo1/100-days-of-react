import { TKeychain } from '@/types'
import { SHA256, PBKDF2, AES, enc } from 'crypto-js'
import { CreateError } from '@/utils'

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
		iterations: 1000,
	}).toString()
}

interface IEncryptVault<T = string> {
	vault: T
	vaultKey: string
}
export function encryptVault<T = TKeychain>({ vault, vaultKey }: IEncryptVault<T>) {
	const serializeVault = JSON.stringify(vault)
	return AES.encrypt(serializeVault, vaultKey).toString()
}

export function decryptVault({ vault, vaultKey }: IEncryptVault<string>) {
	try {
		const decrypted = AES.decrypt(vault, vaultKey).toString(enc.Utf8)
		return JSON.parse(decrypted)
	} catch (err) {
		throw Error(CreateError(err).message)
	}
	return []
}
