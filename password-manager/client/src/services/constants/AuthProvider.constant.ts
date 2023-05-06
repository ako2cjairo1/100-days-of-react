import type { TAuthContext, TAuthProvider } from '@/types'

export const AUTH_CONTEXT = {
	authInfo: {
		email: '',
		vault: '',
		vaultKey: '',
		accessToken: '',
	},
	isLoggedIn: false,
	authenticate: () => Promise.resolve({ success: false, message: '' }),
	authenticatePassport: () => Promise.resolve({ success: false, message: '' }),
	mutateAuth: () => null,
} satisfies TAuthContext<TAuthProvider>
