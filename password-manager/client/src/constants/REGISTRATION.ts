export const registerInitState = {
	CREDENTIALS: { username: '', password: '', confirm: '' },
	STATUS: { success: false, errMsg: '' },
	INPUT_VALIDATION: {
		username: false,
		password: false,
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
		minLength: /^(?=.{12,})/,
		alphabet: /(?=.*[A-Z])(?=.*[a-z])/,
		number: /(?=.*[0-9])/,
		symbol: /(?=.*[-!@.#\$,%\^_&\*])/,
	},
}
