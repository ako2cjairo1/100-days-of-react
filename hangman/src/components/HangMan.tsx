import styles from '../modules/HangMan.module.css'
import { Drawing, GuessingWord } from '.'
import { Keyboard } from './Keyboard'
import { getAlphabet, getRandom } from '../hangmanHelper'
import { useEffect, useState } from 'react'
import words from './words.json'
import { TLetter } from '../types/HangMan.type'

const HangMan = () => {
  const { main, stats } = styles
  const [letters, setKeyboard] = useState<TLetter[]>([])
  const [guessingWord, setGuessingWord] = useState<string>('')
  const [wrongGuessCounter, setWrongGuessCounter] = useState(0)

  useEffect(() => {
    initGame()
  }, [])

  const initGame = () => {
    // TODO: fetch words from an api
    const initGuessingWord = getRandom(words).toLowerCase()
    const initLetters: TLetter[] = getAlphabet().map(letter => {
      return {
        letter,
        isCorrect: initGuessingWord.includes(letter.toLowerCase()),
        isGuessed: false
      }
    })
    setKeyboard(initLetters)
    setGuessingWord(initGuessingWord)
  }

  const isSuccessfulGuess = () => {
    return letters.filter((item) => item.isCorrect).every(({ isGuessed }) => isGuessed)
  }

  const isWrongGuess = (letter: string) => !guessingWord.split("").includes(letter.toLowerCase())

  const isDone = isSuccessfulGuess() || wrongGuessCounter >= 6

  const checkGuessedLetter = ({ letter }: TLetter) => {
    const updatedLetters = letters.map(item => {
      if (item.letter === letter) {
        return {
          ...item,
          isGuessed: true
        }
      }
      return item
    })
    setKeyboard(updatedLetters)
    if (isWrongGuess(letter)) setWrongGuessCounter(prevCount => prevCount + 1)
  }

  return (
    <div className={main}>
      <div className={stats}>{
        isSuccessfulGuess()
          ? "Winner! Refresh play again..."
          : wrongGuessCounter >= 6
            ? "Nice Try - Refresh to try again..."
            : ""
      }</div>
      <Drawing wrongGuessCount={wrongGuessCounter} />
      <GuessingWord word={guessingWord} isDone={isDone} guessedLetters={letters} />
      <Keyboard disabled={isDone} letters={letters} handler={checkGuessedLetter} />
    </div>
  )
}

export default HangMan