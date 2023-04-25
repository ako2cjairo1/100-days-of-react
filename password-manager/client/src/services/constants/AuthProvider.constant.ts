import type { TAuthContext, TAuthProvider } from '@/types'

export const AUTH_CONTEXT = {
	authInfo: {
		email: '',
		vault: '',
		accessToken: '',
	},
	mutateAuth: () => null,
} satisfies TAuthContext<TAuthProvider>
