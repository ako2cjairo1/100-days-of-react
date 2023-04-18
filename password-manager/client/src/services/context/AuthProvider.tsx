import { createContext, useState } from 'react'
import type { TAuthContext, TAuthProvider, IChildren } from '@/types'
import { AUTH_CONTEXT } from '@/services/constants'

export const AuthContext = createContext<TAuthContext<TAuthProvider> | null>(null)

/**
 * AuthProvider component provides authentication context to its children components.
 * @param {ReactNode} children - The child components that will have access to the authentication context.
 * @returns {JSX.Element} The AuthContext provider with the given children components.
 */
export function AuthProvider({ children }: IChildren) {
	const [authInfo, setAuth] = useState<TAuthProvider>(AUTH_CONTEXT.authInfo)

	const mutateAuth = (auth: Partial<TAuthProvider>) => setAuth(prev => ({ ...prev, ...auth }))

	return <AuthContext.Provider value={{ authInfo, mutateAuth }}>{children}</AuthContext.Provider>
}
