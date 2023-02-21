import { useCallback, useEffect, useRef, useState } from 'react'
import styles from '../modules/HangMan.module.css'
import { Drawing, GuessingWord, Keyboard, StatusMessage } from '.'
import { TLetter } from '../types/HangMan.type'
import { getAlphabet, getRandom } from '../hangmanHelper'
import words from './words.json'

const HangMan = () => {
  const { main, stats, newGame } = styles
  const [letters, setKeyboard] = useState<TLetter[]>([])
  const [wordToGuess, setWordToGuess] = useState<string>('')
  const [wrongGuessCounter, setWrongGuessCounter] = useState(0)
  const isInit = useRef(true)

  useEffect(() => {
    if (isInit.current) initGame()

    const keyboardEventHandler = (e: KeyboardEvent) => {
      e.preventDefault()

      if (e.key === 'Enter' && isDone) initGame()
      else if (e.key.match(/^[a-z]$/) && !isDone) checkGuessedLetter(e.key)
    }
    document.addEventListener('keypress', keyboardEventHandler)

    return () => {
      document.removeEventListener('keypress', keyboardEventHandler)
    }
  }, [letters])

  const initGame = () => {
    isInit.current = false
    setWrongGuessCounter(0)
    // TODO: fetch words from an api
    const initGuessingWord = getRandom(words).toLowerCase()
    const initLetters: TLetter[] = getAlphabet().map(letter => {
      return {
        letter: letter.toLowerCase(),
        isCorrect: initGuessingWord.includes(letter.toLowerCase()),
        isGuessed: false,
      }
    })
    setKeyboard(initLetters)
    setWordToGuess(initGuessingWord)
  }

  const isSuccessfulGuess = letters
    .filter(item => item.isCorrect)
    .every(({ isGuessed }) => isGuessed)

  const isWrongGuess = (letter: string) => !wordToGuess.split('').includes(letter.toLowerCase())

  const isDone = isSuccessfulGuess || wrongGuessCounter >= 6

  const checkGuessedLetter = useCallback(
    (letter: string) => {
      if (letters.some(itm => itm.letter === letter && itm.isGuessed)) return
      const updatedLetters = letters.map(item => {
        // mark the guessed letter
        if (item.letter === letter) {
          return {
            ...item,
            isGuessed: true,
          }
        }
        return item
      })
      setKeyboard(updatedLetters)

      if (isWrongGuess(letter)) {
        setWrongGuessCounter(prevCount => prevCount + 1)
      }
    },
    [letters]
  )

  return (
    <div className={main}>
      <div className={stats}>
        <StatusMessage
          isSuccessfulGuess={isSuccessfulGuess}
          wrongGuessCounter={wrongGuessCounter}
        />
        <button
          style={{ visibility: isDone ? 'visible' : 'hidden' }}
          onClick={() => initGame()}
        >
          play again?
        </button>
      </div>
      <Drawing
        isHang={isDone}
        wrongGuessCount={wrongGuessCounter}
      />
      <GuessingWord
        word={wordToGuess}
        isDone={isDone}
        guessedLetters={letters}
      />

      <Keyboard
        disabled={isDone}
        letters={letters}
        handler={checkGuessedLetter}
      />
    </div>
  )
}

export default HangMan
