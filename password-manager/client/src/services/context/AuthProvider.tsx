import { createContext, useState } from 'react'
import type { TAuthContext, TAuthProvider, IChildren, TStatus } from '@/types'
import { AUTH_CONTEXT } from '@/services/constants'
import { TCredentials } from '../../../../shared/types.shared'
import { CreateError, SessionStorage, generateVaultKey, hashPassword } from '../Utils'
import { getSessionService, loginUserService } from '@/api'
import { ISession } from '../../../../shared/interfaces.shared'

export const AuthContext = createContext<TAuthContext<TAuthProvider> | null>(null)

/**
 * AuthProvider component provides authentication context to its children components.
 * @param {ReactNode} children - The child components that will have access to the authentication context.
 * @returns {JSX.Element} The AuthContext provider with the given children components.
 */
export function AuthProvider({ children }: IChildren) {
	const [authInfo, setAuth] = useState<TAuthProvider>(AUTH_CONTEXT.authInfo)

	const mutateAuth = (auth: Partial<TAuthProvider>) => setAuth(prev => ({ ...prev, ...auth }))
	const isLoggedIn = Object.values(authInfo).some(Boolean)
	const createUserSession = ({
		accessToken,
		email,
		hashedPassword,
		salt,
		encryptedVault,
	}: ISession) => {
		// generate vaultKey using combination of email, hashedPassword and "salt" from API
		const vaultKey = generateVaultKey({
			email,
			hashedPassword,
			salt,
		})
		// store Vault and vaultKey in session storage
		SessionStorage.write([
			['PM_VK', vaultKey],
			['PM_encrypted_vault', encryptedVault],
		])
		// !This maybe replaced with cookies
		mutateAuth({ email, vault: encryptedVault, vaultKey, accessToken })
	}
	const authenticate = async ({ email, password }: TCredentials): Promise<TStatus> => {
		try {
			// authenticate user using email and hashed password from API
			// hash password before sending to API
			const session = await loginUserService({
				email,
				password: hashPassword(password),
			})

			if (Object.values(session).some(Boolean)) {
				createUserSession(session)
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
	const authenticatePassport = async (): Promise<TStatus> => {
		try {
			const session = await getSessionService()

			if (Object.values(session).some(Boolean)) {
				createUserSession(session)
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
			message: 'Unauthorized Passport',
		}
	}

	return (
		<AuthContext.Provider
			value={{
				authInfo,
				mutateAuth,
				isLoggedIn,
				authenticate,
				authenticatePassport,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
