import { createContext, useState } from 'react'
import type { TAuthContext, TAuthProvider, IChildren, TStatus } from '@/types'
import { AUTH_CONTEXT } from '@/services/constants'
import { TCredentials } from '../../../../shared/types.shared'
import { CreateError, SessionStorage, generateVaultKey, hashPassword } from '../Utils'
import { loginUserService } from '@/api'

export const AuthContext = createContext<TAuthContext<TAuthProvider> | null>(null)

/**
 * AuthProvider component provides authentication context to its children components.
 * @param {ReactNode} children - The child components that will have access to the authentication context.
 * @returns {JSX.Element} The AuthContext provider with the given children components.
 */
export function AuthProvider({ children }: IChildren) {
	const [authInfo, setAuth] = useState<TAuthProvider>(AUTH_CONTEXT.authInfo)

	const mutateAuth = (auth: Partial<TAuthProvider>) => setAuth(prev => ({ ...prev, ...auth }))
	const isLoggedIn = Object.values(authInfo).every(Boolean)
	const authenticate = async ({ email, password }: TCredentials): Promise<TStatus> => {
		try {
			// hash password before sending to API
			const hashedPassword = hashPassword(password)
			// authenticate user using email and hashed password from API
			const result = await loginUserService({
				email,
				password: hashedPassword,
			})

			if (Object.values(result).some(Boolean)) {
				const { vault, salt, accessToken } = result
				// generate vaultKey using combination of email, hashedPassword and "salt" from API
				const vaultKey = generateVaultKey({
					email,
					hashedPassword,
					salt,
				})
				// store Vault and vaultKey in session storage
				SessionStorage.write([
					['PM_VK', vaultKey],
					['PM_encrypted_vault', vault],
				])
				// !This maybe replaced with cookies
				mutateAuth({ email, vault, vaultKey, accessToken })
				// return successful authentication state
				return {
					success: true,
					message: '',
				}
			}

		} catch (error) {
			return {
				success: false,
				message: CreateError(error).message,
			}
		}

		return {
			success: false,
			message: 'Unauthorize',
		}
	}

	return (
		<AuthContext.Provider value={{ authInfo, mutateAuth, authenticate, isLoggedIn }}>
			{children}
		</AuthContext.Provider>
	)
}
