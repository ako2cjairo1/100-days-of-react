import styles from '../modules/HangMan.module.css'
import { KeyboardProps } from '../types/HangMan.type'

export const Keyboard = ({ letters, handler, disabled }: KeyboardProps) => {
  return (
    <div className={styles.keyboard}>
      {
        letters.map(
          ({ letter, isCorrect, isGuessed }) =>
            <button
              key={letter}
              disabled={isGuessed || disabled}
              className={`${isGuessed && isCorrect ? styles.active : isGuessed ? styles.inactive : ''}`}
              onClick={() => handler({ letter, isCorrect, isGuessed })}>{letter}
            </button>)
      }
    </div>
  )
}
