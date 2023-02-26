import { useCallback, useEffect, useRef, useState } from 'react'
import styles from '../modules/HangMan.module.css'
import { Drawing, WordToGuess, Keyboard, StatusMessage } from '.'
import { TLetter, WordDefinition } from '../types/HangMan.type'
import { getAlphabet, getRandom } from '../hangmanHelper'
import { useFetchWordsAsync } from '../hooks/useFetchWordsAsync'
import processingGif from '../assets/processing.gif'
import requestConfig from '../request_config.json'
import { Hint } from './Hint'

const API_KEY = import.meta.env.VITE_API_KEY
const URL = import.meta.env.VITE_API_URL

const requestData = {
	...requestConfig,
	prompt: requestConfig.prompt.replace('<category here>', 'reactjs and javascript related terms'),
}

const options = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${API_KEY}`,
	},
	body: JSON.stringify(requestData),
}

const HangMan = () => {
	const { main, stats } = styles
	const [words, setWords] = useState<Array<WordDefinition>>([])
	const [letters, setKeyboard] = useState<TLetter[]>([])
	const [wordToGuess, setWordToGuess] = useState<WordDefinition>({ id: 0, word: '', info: '' })
	const [wrongGuessCounter, setWrongGuessCounter] = useState(0)
	const isInit = useRef(true)

	const { data, error, isLoading } = useFetchWordsAsync(URL, options)

	useEffect(() => {
		if (!isLoading && data && words.length <= 0) {
			const formattedWordDefinition = data.map(item => {
				let formattedWord = item.word.toLowerCase()
				return {
					...item,
					word: formattedWord,
					info: item.info.toLowerCase().replace(formattedWord, ''),
				}
			})
			setWords(formattedWordDefinition)
		}

		if (isInit.current && !isLoading && words.length > 0 && !error) {
			initGame()
		}

		const keyboardEventHandler = (e: KeyboardEvent) => {
			e.preventDefault()

			if (e.key === 'Enter' && isDone) initGame()
			else if (e.key.match(/^[a-z]$/) && !isDone) checkGuessedLetter(e.key)
		}
		document.addEventListener('keypress', keyboardEventHandler)

		return () => {
			document.removeEventListener('keypress', keyboardEventHandler)
		}
	}, [letters, isLoading, words])

	const initGame = () => {
		isInit.current = false
		setWrongGuessCounter(0)

		// get random item from words and convert to lowercase
		const initGuessingWord = getRandom(words)

		// remove the word-to-guess from the words list
		setWords(words.filter(item => item.word !== initGuessingWord.word))

		const initLetters: TLetter[] = getAlphabet().map(letter => {
			return {
				letter: letter.toLowerCase(),
				//mark the letters composing the word to guess
				isCorrect: initGuessingWord.word.includes(letter.toLowerCase()),
				isGuessed: false,
			}
		})
		setKeyboard(initLetters)
		setWordToGuess(initGuessingWord)
	}

	const isSuccessfulGuess = letters
		.filter(item => item.isCorrect)
		.every(({ isGuessed }) => isGuessed)

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

			const isWrongGuess = (letter: string) =>
				!wordToGuess.word.split('').includes(letter.toLowerCase())
			if (isWrongGuess(letter)) {
				setWrongGuessCounter(prevCount => prevCount + 1)
			}
		},
		[letters]
	)

	if (isLoading || (words && words.length <= 0)) {
		return (
			<div style={{ textAlign: 'center' }}>
				<img
					src={processingGif}
					style={{ width: '50px', marginLeft: '40%', marginBottom: '20px' }}
				/>
				<p>Fetching random words from internet...</p>
				<p>Give me a moment.</p>
			</div>
		)
	} else if (!isLoading && error) {
		return <p>{error.message}</p>
	}

	return (
		<div className={main}>
			<div className={stats}>
				<StatusMessage {...{ isSuccessfulGuess, wrongGuessCounter }} />
				<button
					style={{ visibility: isDone ? 'visible' : 'hidden' }}
					onClick={() => initGame()}
				>
					play again?
				</button>
			</div>
			<Drawing {...{ isDone, wrongGuessCounter }} />
			<WordToGuess
				cssModule={styles}
				wordToGuess={wordToGuess.word}
				{...{ letters, isDone }}
			/>
			<Hint
				cssModule={styles}
				{...{ wordToGuess, wrongGuessCounter, isDone }}
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
