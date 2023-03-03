import { GuessingWordProps } from '../types/HangMan.type'

export const WordToGuess = ({ cssModule, wordToGuess, isDone, keyboard }: GuessingWordProps) => {
	const { letter, underline } = cssModule
	const splitWordToGuess = wordToGuess.split('')

	const isReveal = (guessedLetter: string) => {
		return keyboard.some(({ letter, isCorrect, isGuessed }) =>
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
