import { PasswordStatus } from '@/services/constants'
import { RTPasswordEval, TPasswordEval } from '@/types/PasswordManager.type'

const evaluatePassword = (password: string, regex?: RegExp): RTPasswordEval => {
	if (!regex) {
		regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
	}
	const commonPw = [
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

	const length = password.length
	let score = 0

	if (length < 8) score = 10
	else if (commonPw.includes(password)) score = 30
	else if (!regex.test(password)) score = 60
	else if (length >= 12 && length <= 16) score = 80
	else if (length >= 17 && length <= 24) score = 90
	else score = 100

	const { weak, mediocre, secure, strong, unbreakable } = PasswordStatus
	return {
		status:
			score <= 30
				? weak
				: score <= 60
				? mediocre
				: score <= 80
				? secure
				: score <= 90
				? strong
				: unbreakable,
		score,
	}
}

export const PasswordStrength = ({ password, regex }: TPasswordEval) => {
	const { status, score } = evaluatePassword(password, regex)
	const { none, weak, mediocre, secure, strong, unbreakable } = PasswordStatus

	return (
		<div className="password-strength">
			<p className={`xsmall smooth ${password ? 'show' : 'hidden'}`}>{status}</p>

			{Object.values(PasswordStatus).map((strength, idx) => {
				let customAnimation = ''
				if (password && strength === weak) customAnimation = `scaleup ${status}`
				else if (
					password &&
					((strength === weak && score <= 10) ||
						(strength === mediocre && score <= 30) ||
						(strength === secure && score <= 60) ||
						(strength === strong && score <= 80) ||
						(strength === unbreakable && score < 100))
				)
					customAnimation = `scaledown ${none}`
				else if (password && strength !== none) {
					customAnimation = `scaleup ${status}`
				}

				return (
					<div
						key={idx}
						style={{ animationDelay: `${idx * 0.1}s` }}
						className={`smooth ${customAnimation}`}
					></div>
				)
			})}
		</div>
	)
}
