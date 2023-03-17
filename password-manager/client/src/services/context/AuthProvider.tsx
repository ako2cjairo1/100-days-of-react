import { TAuthContext, TAuthProvider } from '@/types/PasswordManager.type'
import { createContext, ReactNode, useState } from 'react'

export const AuthContext = createContext<TAuthContext<TAuthProvider>>({
	auth: { email: '', password: '', accessToken: '' },
	setAuth: () => undefined,
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
	const [auth, setAuth] = useState({
		accessToken: '',
		username: '',
		password: '',
	})

	return <AuthContext.Provider value={{ auth, setAuth }}>{children}</AuthContext.Provider>
}
