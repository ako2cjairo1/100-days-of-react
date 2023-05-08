import type { TAuthContext, TAuthProvider } from '@/types'

export const AUTH_CONTEXT = {
	authInfo: {
		email: '',
		vault: '',
		vaultKey: '',
		accessToken: '',
		isLoggedIn: false,
	},
	mutateAuth: () => null,
	authenticate: () => Promise.resolve({ success: false, message: '' }),
} satisfies TAuthContext<TAuthProvider>
