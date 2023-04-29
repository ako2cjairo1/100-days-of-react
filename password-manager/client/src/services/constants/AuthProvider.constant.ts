import type { TAuthContext, TAuthProvider } from '@/types'

export const AUTH_CONTEXT = {
	authInfo: {
		email: '',
		vault: '',
		vaultKey: '',
		accessToken: '',
	},
	mutateAuth: () => null,
} satisfies TAuthContext<TAuthProvider>
