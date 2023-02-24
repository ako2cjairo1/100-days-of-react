import { StatusMessageProps } from "../types/HangMan.type"

export const StatusMessage = ({
	wrongGuessCounter,
	isSuccessfulGuess,
}: StatusMessageProps) => {
	let message = <p></p>
	const lifeCount = 6 - wrongGuessCounter
	if (isSuccessfulGuess) {
		message = <p>Good job!</p>
	} else if (wrongGuessCounter >= 6) {
		message = <p>Nice try...</p>
	} else if (lifeCount < 6) {
		message = (
			<p>
				You only have{' '}
				{lifeCount <= 3 ? <span style={{ color: 'red' }}>{lifeCount}</span> : lifeCount} more
				chances.
			</p>
		)
	}

	return message
}
