import { createContext, useCallback, useState } from 'react'
import type { TAuthContext, TAuthProvider, IChildren, TStatus } from '@/types'
import type { ISession, TCredentials } from '@shared'
import { AUTH_CONTEXT } from '@/services/constants'
import { CreateError, SessionStorage, generateVaultKey, hashPassword } from '../Utils'
import { getSessionService, loginUserService } from '@/services/api'

export const AuthContext = createContext<TAuthContext<TAuthProvider> | null>(null)

/**
 * AuthProvider component provides authentication context to its children components.
 */
export function AuthProvider({ children }: IChildren) {
	const [authInfo, setAuth] = useState<TAuthProvider>(AUTH_CONTEXT.authInfo)

	const mutateAuth = (auth: Partial<TAuthProvider>) => setAuth(prev => ({ ...prev, ...auth }))
	const createUserSession = useCallback(
		({ accessToken, email, hashedPassword, salt, encryptedVault }: ISession) => {
			// generate vaultKey using combination of email, hashedPassword and "salt" from API
			const vaultKey = generateVaultKey({ email, hashedPassword, salt })
			// store encrypted Vault in session storage
			SessionStorage.write([['PM_encrypted_vault', encryptedVault]])
			// !This maybe replaced with cookies
			mutateAuth({ email, vault: encryptedVault, vaultKey, accessToken, isLoggedIn: true })
		},
		[]
	)
	const authenticate = useCallback(
		async (credential?: TCredentials): Promise<TStatus> => {
			let session: ISession
			const status: TStatus = {
				success: false,
				message: 'Unauthorize',
			}

			try {
				// authenticate user using email and hashed password from API
				if (credential) {
					const { email, password } = credential
					session = await loginUserService({
						email,
						// hash password before sending to API
						password: hashPassword(password),
					})
					status.message = ''
				} else {
					// check for valid session to auth server (oAuth: Github, Google, Meta)
					session = await getSessionService()
					status.message = 'Authentication Successful!'
				}

				if (Object.values(session).some(Boolean)) {
					createUserSession(session)
					// return successful authentication state
					status.success = true
					return status
				}
			} catch (error) {
				// reset auth context
				mutateAuth(AUTH_CONTEXT.authInfo)
				return {
					success: false,
					message: CreateError(error).message,
				}
			}

			// else, Unauthorize
			// reset auth context
			mutateAuth(AUTH_CONTEXT.authInfo)
			return status
		},
		[createUserSession]
	)

	return (
		<AuthContext.Provider
			value={{
				authInfo,
				mutateAuth,
				authenticate,
			}}
		>
			{children}
		</AuthContext.Provider>
	)
}
