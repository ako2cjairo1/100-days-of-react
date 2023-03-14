export const passwordStrength = (password: string, regex?: RegExp) => {
	if (!regex) {
		regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
	}
	const commonPhrases = [
		'password',
		'123456',
		'qwerty',
		'abc123',
		'111111',
		'12345678',
		'1234567',
		'1234567890',
		'iloveyou',
		'princess',
		'sunshine',
		'monkey',
		'qazwsx',
		'trustno1',
	]
	if (password.length < 8) {
		return 10
	} else if (commonPhrases.includes(password)) {
		return 30
	} else if (!regex.test(password)) {
		return 60
	} else if (password.length >= 8 && password.length <= 12) {
		return 80
	} else {
		return 100
	}
}
