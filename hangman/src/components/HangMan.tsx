import { useCallback, useEffect, useRef, useState } from 'react'
import cssModule from '../modules/HangMan.module.css'
import { Drawing, WordToGuess, Keyboard, StatusMessage } from '.'
import { TLetter, WordDefinition } from '../types/HangMan.type'
import { getAlphabet, getRandom } from '../hangmanHelper'
import { Hint } from './Hint'
import { useFetchWordsAsync } from '../hooks/useFetchWordsAsync'
import { Loader } from './Loader'
import { Error } from './Error'
import { Menu } from './Menu'

const HangMan = () => {
	const { main, stats } = cssModule
	const [words, setWords] = useState<Array<WordDefinition>>([])
	const [keyboard, setKeyboard] = useState<TLetter[]>([])
	const [wordToGuess, setWordToGuess] = useState<WordDefinition>({ id: 0, word: '', info: '' })
	const [wrongGuessCounter, setWrongGuessCounter] = useState(0)
	const isInit = useRef(false)
	const isFetch = useRef(false)
	const [category, setCategory] = useState({ category: 'pokemon names', itemCount: 10 })
	const [catName, setCatName] = useState('')
	const [isChangeCategory, setIsChangeCategory] = useState(true)

	const { fetchedWords, error, isDoneFetch, startFetch, clearFetchedWords } = useFetchWordsAsync({
		options: category,
	})

	const isSuccessfulGuess = keyboard.length
		? keyboard.filter(item => item.isCorrect).every(({ isGuessed }) => isGuessed)
		: false

	const isDone = isSuccessfulGuess || wrongGuessCounter >= 6

	const keyboardEventHandler = (e: KeyboardEvent) => {
		e.preventDefault()

		if (e.key === 'Enter' && isDone) {
			initGame()
			fetchNewSetOfWords()
			document.removeEventListener('keypress', keyboardEventHandler)
		} else if (e.key.match(/^[A-Za-z]$/) && !isDone) checkGuessedLetter(e.key)
	}

	useEffect(() => {
		if (isInit.current && words.length) initGame()

		if (fetchedWords.length && isDoneFetch && !error && !words.length) {
			console.info('[Success fetch!]')
			const formattedWords = fetchedWords.map(({ id, word, info }) => {
				let lowerCaseWord = word.toLowerCase()
				return {
					id,
					word: lowerCaseWord,
					// make sure to remove "word to guess" on hints
					info: info.toLowerCase().replace(lowerCaseWord, ''),
				}
			})
			setWords(formattedWords)
			if (formattedWords.length) {
				isInit.current = true
				isFetch.current = true
				clearFetchedWords()
			}
		}

		if (!isChangeCategory) document.addEventListener('keypress', keyboardEventHandler)

		if (isDone && !words.length) document.removeEventListener('keypress', keyboardEventHandler)

		return () => {
			document.removeEventListener('keypress', keyboardEventHandler)
		}
	}, [keyboard, words, isDoneFetch])

	const fetchNewSetOfWords = () => {
		if (isFetch.current && !fetchedWords.length && !words.length && isDone) {
			setIsChangeCategory(true)
			setKeyboard([])
			startFetch.current = true
			isFetch.current = false
			setCategory({ category: catName, itemCount: 10 })
		}
	}

	const fetchInitialGame = () => {
		setIsChangeCategory(false)
		setKeyboard([])
		startFetch.current = true
		isFetch.current = false
		setCategory({ category: catName, itemCount: 10 })
	}

	const initGame = () => {
		if (words.length) {
			isInit.current = false
			setWrongGuessCounter(0)
			// get random item from words and convert to lowercase
			const initGuessingWord = getRandom(words)

			console.log(initGuessingWord)

			// remove the word-to-guess from the words list
			setWords(words.filter(item => item.word !== initGuessingWord.word))

			const initLetters: TLetter[] = getAlphabet(true).map(letter => {
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
	}

	const checkGuessedLetter = useCallback(
		(letter: string) => {
			if (keyboard.some(itm => itm.letter === letter.toLowerCase() && itm.isGuessed)) return
			setKeyboard(
				keyboard.map(item => {
					// mark the guessed letter
					if (item.letter === letter.toLowerCase()) {
						return {
							...item,
							isGuessed: true,
						}
					}
					return item
				})
			)

			const isWrongGuess = (letter: string) =>
				!wordToGuess.word.split('').includes(letter.toLowerCase())
			if (isWrongGuess(letter)) setWrongGuessCounter(prevCount => prevCount + 1)
		},
		[keyboard]
	)

	if (!isChangeCategory && !isDoneFetch && !words.length) return <Loader />
	else if (error) return <Error message={error.message} />

	return (
		<div className={main}>
			<Drawing {...{ isDone, wrongGuessCounter }} />
			<div className={stats}>
				<StatusMessage {...{ cssModule, isSuccessfulGuess, wrongGuessCounter }} />
			</div>
			<WordToGuess
				wordToGuess={wordToGuess.word}
				{...{ cssModule, keyboard, isDone }}
			/>
			<Hint {...{ cssModule, category, wordToGuess, wrongGuessCounter, isDone }} />

			{!isChangeCategory && !isDone ? (
				<Keyboard
					disabled={isDone}
					letters={keyboard}
					handler={checkGuessedLetter}
				/>
			) : (
				<Menu
					isDone={isDone && words.length ? true : false}
					{...{ setCatName, cssModule, category, catName, fetchInitialGame, initGame }}
				/>
			)}
		</div>
	)
}

export default HangMan
