import '@/assets/modules/PasswordStrength.css'
import { TEvaluatedPassword } from '@/types'
import { PasswordStatus } from '@/services/constants'
import { useEffect, useState } from 'react'

const { weak, mediocre, secure, strong, unbreakable, none } = PasswordStatus
/**
 * Evaluates the strength of a password based on its length and whether it meets certain requirements.
 *
 * param password - The password to evaluate.
 * param regex - An optional regular expression to test if the password meets certain requirements.
 * 				If not provided, a default regular expression is used.
 * returns An object of type RTPasswordEval with two properties:
 * 		status (a string representing the strength of the password) and
 * 		score (a number representing the score of the password).
 */
export function evaluatePassword({ password, regex }: IPasswordStrength): TEvaluatedPassword {
	if (!password) return { status: weak, score: 0 }
	if (!regex) {
		regex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/
	}

	const length = password.length
	let score = 0

	if (length < 8) score = 1
	else if (!regex.test(password)) score = 2
	else if (length >= 12 && length <= 16) score = 3
	else if (length >= 17 && length <= 24) score = 4
	else if (length >= 16 && regex.test(password)) score = 5
	else score = 2

	return {
		score,
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
	}
}

export interface IPasswordStrength {
	password?: string
	regex?: RegExp
}
/**
 * Renders a password strength meter based on the given password and regex.
 *
 * param {string} password - The password being evaluated.
 * param {RegExp} regex - The regular expression used to evaluate the password.
 *
 * returns {FCProps} A Custom Password Strength indicator component
 */
export function PasswordStrength({ password, regex }: Partial<IPasswordStrength>) {
	const { status, score } = evaluatePassword({ password, regex })
	const [toggleAnimation, setToggleAnimation] = useState(false)
	const passwordStatuses = Object.values(PasswordStatus).filter(status => status !== none)
	const len = passwordStatuses.length

	useEffect(() => {
		setToggleAnimation(prev => !prev)
	}, [status])

	return (
		<div className="password-strength">
			{password && (
				<p
					className={`x-small smooth ${
						password ? `show ${toggleAnimation ? 'scale-up' : 'scale-down'}` : 'hidden'
					}`}
				>
					{status}
				</p>
			)}
			{passwordStatuses.map((_, idx) => {
				const statusIndex = idx + 1
				let customAnimation = ''

				if (password && statusIndex <= score) customAnimation = `scale-up ${status}`
				else customAnimation = `scale-down ${none}`

				// determine opacity of bullet based on its index
				const opacity = statusIndex === len - 1 ? 1 : Math.round(statusIndex * (1 / len) * 10) / 10
				// Render all status except 'none'
				// should only render exactly 5 bullets (or div)

				return (
					<div
						key={statusIndex}
						id="bullet"
						style={{ opacity, animationDelay: `${statusIndex * 0.1}s` }}
						className={`smooth ${customAnimation}`}
					></div>
				)
			})}
		</div>
	)
}
