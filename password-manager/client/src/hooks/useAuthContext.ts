import { AuthContext } from '@/services/context'
import { useContext } from 'react'

/**
 * A custom hook that returns the value of the AuthContext.
 * throws An error if the AuthContext is missing.
 * returns The value of the AuthContext.
 */
export function useAuthContext() {
	const context = useContext(AuthContext)

	if (!context) {
		throw new Error('AuthContext is missing')
	}

	return context
}
