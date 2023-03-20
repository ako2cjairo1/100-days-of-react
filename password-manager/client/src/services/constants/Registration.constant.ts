import { TCredentials, TMapKeyValuesOf, TPassword, TStatus, TValidInput } from '@/types'

export const registerInitState: {
	CREDENTIALS: TCredentials
	STATUS: TStatus
	INPUT_VALIDATION: TValidInput
	VALID_PASSWORD: TPassword
	EMAIL_REGEX: RegExp
	PASSWORD_REGEX: TMapKeyValuesOf<TPassword, RegExp>
} = {
	CREDENTIALS: { email: '', password: '', confirm: '' },
	STATUS: { success: false, errMsg: '' },
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
		minLength: /^(?=.{12})/,
		alphabet: /(?=.*[A-Z])(?=.*[a-z])/,
		number: /(?=.*[0-9])/,
		symbol: /(?=.*[-!@.#$,%^_&*])/,
	},
}
