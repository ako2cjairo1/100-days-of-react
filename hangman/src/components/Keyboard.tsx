import styles from '../modules/Keyboard.module.css'
import { KeyboardProps } from '../types/HangMan.type'

export const Keyboard = ({ letters, handler, disabled }: KeyboardProps) => {
  const { active, inactive, keyboard } = styles
  return (
    <div className={keyboard}>
      {letters.map(({ letter, isCorrect, isGuessed }) => (
        <button
          key={letter}
          disabled={isGuessed || disabled}
          className={isGuessed && isCorrect ? active : isGuessed ? inactive : ''}
          onClick={() => handler(letter)}
        >
          {letter}
        </button>
      ))}
    </div>
  )
}
