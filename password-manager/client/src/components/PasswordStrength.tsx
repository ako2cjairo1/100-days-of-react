import { FCProps, EvaluatedPassword, IPasswordStrength } from '@/types'
import { PasswordStatus } from '@/services/constants'
/**
 * Evaluates the strength of a password based on its length and whether it meets certain requirements.
 *
 * @param password - The password to evaluate.
 * @param regex - An optional regular expression to test if the password meets certain requirements.
 * 				If not provided, a default regular expression is used.
 * @returns An object of type RTPasswordEval with two properties:
 * 		status (a string representing the strength of the password) and
 * 		score (a number representing the score of the password).
 */
export const evaluatePassword = ({ password, regex }: IPasswordStrength): EvaluatedPassword => {
	if (!regex) {
		regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/
	}

	const { weak, mediocre, secure, strong, unbreakable } = PasswordStatus
	const length = password.length
	let score = 0

	if (length < 8) score = 1
	else if (!regex.test(password)) score = 2
	else if (length >= 12 && length <= 16) score = 3
	else if (length >= 17 && length <= 24) score = 4
	else score = 5

	return {
		status:
			score === 1
				? weak
				: score === 2
				? mediocre
				: score === 3
				? secure
				: score === 4
				? strong
				: unbreakable,
		score,
	}
}

/**
 * Renders a password strength meter based on the given password and regex.
 *
 * @param {string} props.password - The password being evaluated.
 * @param {RegExp} props.regex - The regular expression used to evaluate the password.
 *
 * @returns {FCProps} A Custom Password Strength indicator component
 */
export const PasswordStrength: FCProps<IPasswordStrength> = ({ password, regex }) => {
	const { status, score } = evaluatePassword({ password, regex })

	return (
		<div className="password-strength">
			<p className={`xsmall smooth ${password ? 'show' : 'hidden'}`}>{status}</p>

			{Object.values(PasswordStatus).map((strength, idx) => {
				// Do not render the default status
				if (strength === PasswordStatus.none) return null

				let customAnimation = `scaledown ${PasswordStatus.none}`
				if (password && idx + 1 <= score) customAnimation = `scaleup ${status}`

				// Renders all the strength except 'none'
				// should only render exactly 5 bullets (or divs)
				return (
					<div
						key={idx}
						id="bullet"
						style={{ animationDelay: `${idx * 0.1}s` }}
						className={`smooth ${customAnimation}`}
					></div>
				)
			})}
		</div>
	)
}
