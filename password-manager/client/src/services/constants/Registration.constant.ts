import type {
	TConvertKeysOf,
	TPassword,
	TStatus,
	TInputValidation,
	TInputRegistration,
} from '@/types'

export const REGISTER_STATE = {
	CREDENTIALS: { email: '', password: '', confirm: '', isTermsAgreed: false },
	STATUS: { success: false, message: '' },
	INPUT_VALIDATION: {
		isValidEmail: false,
		isValidPassword: false,
	},
	VALID_PASSWORD: {
		minLength: false,
		alphabet: false,
		number: false,
		symbol: false,
	},
	EMAIL_REGEX:
		/^[a-zA-Z0-9]+([._]?[a-zA-Z0-9]+)*@[a-zA-Z0-9]+([.-]?[a-zA-Z0-9]+)*(\.[a-zA-Z]{2,4})+$/,
	PASSWORD_REGEX: {
		minLength: /^(?=.{8})/,
		alphabet: /(?=.*[A-Z])(?=.*[a-z])/,
		number: /(?=.*[0-9])/,
		symbol: /(?=.*[-!@.#$,%^_&*])/,
	},
} satisfies Record<'CREDENTIALS', TInputRegistration> &
	Record<'STATUS', TStatus> &
	Record<'INPUT_VALIDATION', TInputValidation> &
	Record<'VALID_PASSWORD', TPassword> &
	Record<'EMAIL_REGEX', RegExp> &
	Record<'PASSWORD_REGEX', TConvertKeysOf<TPassword, RegExp>>
