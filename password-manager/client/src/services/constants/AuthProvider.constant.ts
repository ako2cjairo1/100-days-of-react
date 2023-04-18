import type { TAuthContext, TAuthProvider } from '@/types'

export const AUTH_CONTEXT = {
	authInfo: {
		email: '',
		password: '',
		accessToken: '',
	},
	mutateAuth: () => null,
} satisfies TAuthContext<TAuthProvider>
