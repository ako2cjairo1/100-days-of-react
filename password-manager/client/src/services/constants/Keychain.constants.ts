import type { TExportKeychain, TKeychain, TStatus } from '@/types'

export const KEYCHAIN_CONST = {
	INIT_STATUS: { success: false, message: '' },
	INIT_KEYCHAIN: {
		keychainId: '',
		password: '',
		username: '',
		website: '',
		logo: '',
	},
	WEBSITE_REGEX: /^(https?:\/\/)?((localhost)|([\da-z.-]+)\.([a-z.]{2,6}))([/\w .-]*)*\/?$/,
	ILLEGAL_REGEX: /(?=.*[,])/,
	HEADERS: {
		website: 'URL',
		username: 'Username',
		password: 'Password',
	},
} satisfies {
	INIT_STATUS: TStatus
	INIT_KEYCHAIN: TKeychain
	WEBSITE_REGEX: RegExp
	ILLEGAL_REGEX: RegExp
	HEADERS: TExportKeychain
}
