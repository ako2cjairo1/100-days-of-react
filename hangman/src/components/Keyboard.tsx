import styles from '../modules/Keyboard.module.css'
import { KeyboardProps } from '../types/HangMan.type'

export const Keyboard = ({ letters, handler, disabled }: KeyboardProps) => {
	const { active, inactive, keyboard, winner } = styles

	return (
		<div className={keyboard}>
			<div className={keyboard}>
				{letters.map(
					({ letter, isCorrect, isGuessed }, idx) =>
						idx <= 9 && (
							<button
								key={letter}
								disabled={isGuessed || disabled}
								className={isGuessed && isCorrect ? active : isGuessed ? inactive : ''}
								onClick={() => handler(letter)}
								style={{
									animation: winner,
									animationDelay: `${idx * 0.1}s`,
								}}
							>
								{letter}
							</button>
						)
				)}
			</div>
			<div className={keyboard}>
				{letters.map(
					({ letter, isCorrect, isGuessed }, idx) =>
						idx >= 10 &&
						idx <= 18 && (
							<button
								key={letter}
								disabled={isGuessed || disabled}
								className={isGuessed && isCorrect ? active : isGuessed ? inactive : ''}
								onClick={() => handler(letter)}
								style={{
									animation: winner,
									animationDelay: `${idx * 0.1}s`,
								}}
							>
								{letter}
							</button>
						)
				)}
			</div>
			<div className={keyboard}>
				{letters.map(
					({ letter, isCorrect, isGuessed }, idx) =>
						idx >= 19 && (
							<button
								key={letter}
								disabled={isGuessed || disabled}
								className={isGuessed && isCorrect ? active : isGuessed ? inactive : ''}
								onClick={() => handler(letter)}
								style={{
									animation: winner,
									animationDelay: `${idx * 0.1}s`,
								}}
							>
								{letter}
							</button>
						)
				)}
			</div>
		</div>
	)
}
