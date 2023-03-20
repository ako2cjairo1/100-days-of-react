import { TAuthContext, TAuthProvider, FCChildProp } from '@/types'
import { createContext, useState } from 'react'
import { authProviderInitState } from '../constants'

export const AuthContext = createContext<TAuthContext<TAuthProvider>>({
	auth: authProviderInitState,
	setAuth: () => {},
})

/**
 * AuthProvider component provides authentication context to its children components.
 * @param {ReactNode} children - The child components that will have access to the authentication context.
 * @returns {JSX.Element} The AuthContext provider with the given children components.
 */
export const AuthProvider: FCChildProp = ({ children }) => {
	const [auth, setAuth] = useState<TAuthProvider>(authProviderInitState)

	return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>
}
