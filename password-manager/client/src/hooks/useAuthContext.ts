import { AuthContext } from '@/services/context'
import { useContext } from 'react'

export const useAuthContext = () => {
	const context = useContext(AuthContext)

	if (!context) {
		throw new Error('AuthContext is missing')
	}

	return context
}
