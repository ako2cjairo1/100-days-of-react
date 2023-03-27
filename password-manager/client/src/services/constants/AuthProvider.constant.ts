import { TAuthContext, TAuthProvider } from '@/types'

export const AUTH_CONTEXT = {
	authInfo: {
		email: '',
		password: '',
		accessToken: '',
	},
	updateAuthInfo: () => null,
} satisfies TAuthContext<TAuthProvider>
