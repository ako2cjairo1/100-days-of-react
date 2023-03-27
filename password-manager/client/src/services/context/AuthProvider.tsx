import { TAuthContext, TAuthProvider, FCWithChildren } from '@/types'
import { createContext, useState } from 'react'
import { AUTH_CONTEXT } from '@/services/constants'

export const AuthContext = createContext<TAuthContext<TAuthProvider>>(AUTH_CONTEXT)

/**
 * AuthProvider component provides authentication context to its children components.
 * @param {ReactNode} children - The child components that will have access to the authentication context.
 * @returns {JSX.Element} The AuthContext provider with the given children components.
 */
export const AuthProvider: FCWithChildren = ({ children }) => {
	const [auth, setAuth] = useState<TAuthProvider>(AUTH_CONTEXT.authInfo)

	const updateAuthCb = (auth: TAuthProvider) => setAuth(auth)

	return (
		<AuthContext.Provider value={{ authInfo: auth, updateAuthInfo: updateAuthCb }}>
			{children}
		</AuthContext.Provider>
	)
}
