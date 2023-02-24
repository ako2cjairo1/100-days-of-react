import { useCallback, useEffect, useRef, useState } from 'react'
import styles from '../modules/HangMan.module.css'
import { Drawing, WordToGuess, Keyboard, StatusMessage } from '.'
import { TLetter, WordDictionary } from '../types/HangMan.type'
import { getAlphabet, getRandom } from '../hangmanHelper'
import { useFetchWordsAsync } from '../hooks/useFetchWordsAsync'
import processingGif from '../assets/processing.gif'
import requestConfig from '../request_config.json'

const API_KEY = import.meta.env.VITE_API_KEY
const URL = import.meta.env.VITE_API_URL

const options = {
	method: 'POST',
	headers: {
		'Content-Type': 'application/json',
		Authorization: `Bearer ${API_KEY}`,
	},
	body: JSON.stringify(requestConfig),
}

const HangMan = () => {
	const { main, stats } = styles
	const [words, setWords] = useState<WordDictionary>([])
	const [letters, setKeyboard] = useState<TLetter[]>([])
	const [wordToGuess, setWordToGuess] = useState<string>('')
	const [wrongGuessCounter, setWrongGuessCounter] = useState(0)
	const isInit = useRef(true)

	const { data, error, isLoading } = useFetchWordsAsync(URL, options)

	useEffect(() => {
		if (isInit.current && !isLoading && words.length > 0 && !error) {
			initGame()
		}

		if (!isLoading && data && words.length <= 0) {
			setWords(data)
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
		console.log('INIT GAME', words)
		isInit.current = false
		setWrongGuessCounter(0)

		const initGuessingWord = getRandom(Object.values(words).map(item => item.word)).toLowerCase()

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

			const isWrongGuess = (letter: string) => !wordToGuess.split('').includes(letter.toLowerCase())
			if (isWrongGuess(letter)) {
				setWrongGuessCounter(prevCount => prevCount + 1)
			}
		},
		[letters]
	)

	if (isLoading) {
		return (<span>
			<img
				src={processingGif}
				style={{ width: '50px' }}
			/>
			Fetching random words from internet...
		</span>)
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
			<WordToGuess {...{ wordToGuess, isDone, letters }} />
			<p>
				Hint:{' '}
				<q>
					<cite>{words.find(w => w.word === wordToGuess)?.definition ?? '...'}</cite>
				</q>
			</p>
			<Keyboard
				disabled={isDone}
				letters={letters}
				handler={checkGuessedLetter}
			/>
		</div>
	)
}

export default HangMan
