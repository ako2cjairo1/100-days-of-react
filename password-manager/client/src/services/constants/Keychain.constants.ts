import type { TKeychain, TStatus } from '@/types'

export const KEYCHAIN_CONST = {
	STATUS: { success: false, message: '' },
	KEYCHAIN: {
		keychainId: '',
		password: '',
		username: '',
		website: '',
		logo: '',
	},
	WEBSITE_REGEX: /^(https?:\/\/)?((localhost)|([\da-z.-]+)\.([a-z.]{2,6}))([/\w .-]*)*\/?$/,
} satisfies {
	STATUS: TStatus
	KEYCHAIN: TKeychain
	WEBSITE_REGEX: RegExp
}
