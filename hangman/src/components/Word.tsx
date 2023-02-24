import styles from '../modules/HangMan.module.css'
import { GuessingWordProps } from '../types/HangMan.type'

export const WordToGuess = ({ wordToGuess, isDone, letters }: GuessingWordProps) => {
	const { letter, underline, winner } = styles
	const splitWordToGuess = wordToGuess.split('')

	const isReveal = (guessedLetter: string) => {
		return letters.some(({ letter, isCorrect, isGuessed }) =>
			guessedLetter.toLowerCase() === letter.toLowerCase() && isCorrect && isGuessed ? true : false
		)
	}

	return (
		<div className={letter}>
			{splitWordToGuess.map((letter, idx) => {
				return (
					<span
						key={idx}
						className={underline}
					>
						<span
							style={{
								visibility: isReveal(letter) || isDone ? 'visible' : 'hidden',
								color: isDone && !isReveal(letter) ? 'red' : 'currentColor',
								animation: winner,
								animationDelay: `${idx * 0.1}s`,
							}}
						>
							{letter}
						</span>
					</span>
				)
			})}
		</div>
	)
}
