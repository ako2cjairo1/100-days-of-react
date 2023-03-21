import { TAuthContext, TAuthProvider, FCChildProp } from '@/types'
import { createContext, useState } from 'react'
import { AUTH_PROVIDER } from '../constants'

export const AuthContext = createContext<TAuthContext<TAuthProvider>>({
	auth: AUTH_PROVIDER,
	setAuth: () => {},
})

/**
 * AuthProvider component provides authentication context to its children components.
 * @param {ReactNode} children - The child components that will have access to the authentication context.
 * @returns {JSX.Element} The AuthContext provider with the given children components.
 */
export const AuthProvider: FCChildProp = ({ children }) => {
	const [auth, setAuth] = useState<TAuthProvider>(AUTH_PROVIDER)

	return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>
}
