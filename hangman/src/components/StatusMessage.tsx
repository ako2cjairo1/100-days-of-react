import { StatusMessageProps } from '../types/HangMan.type'
import confetti from 'canvas-confetti'
import { getRandom } from '../hangmanHelper'
import { memo } from 'react'

export const StatusMessage = memo(
	({ cssModule, wrongGuessCounter, isSuccessfulGuess }: StatusMessageProps) => {
		const { emoji, tilt } = cssModule
		const lifeCount = 6 - wrongGuessCounter

		if (isSuccessfulGuess) {
			confetti({
				origin: { x: 0.5, y: 0.85 },
				particleCount: 50,
				spread: 100,
				startVelocity: 90,
			})
		}

		const emojiStyle = `${emoji} ${tilt}`

		return isSuccessfulGuess ? (
			<p>
				<span className={emojiStyle}>{getRandom(['🙌', '👍', '🥳', '🤩', '🎉'])}</span> Good job!
			</p>
		) : wrongGuessCounter >= 6 ? (
			<p>
				<span className={emojiStyle}>{getRandom(['😢', '👎', '😞', '💩'])}</span> Nice try...
			</p>
		) : lifeCount < 6 ? (
			<p>
				{lifeCount <= 3 && <span className={emojiStyle}>🚩</span>} {lifeCount} more chance(s)
			</p>
		) : null
	}
)
