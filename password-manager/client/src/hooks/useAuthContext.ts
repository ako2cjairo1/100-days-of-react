import { AuthContext } from '@/services/context'
import { TAuthContext, TAuthProvider } from '@/types'
import { useContext } from 'react'

export default function useAuthContext(): TAuthContext<TAuthProvider> {
	return useContext(AuthContext)
}
