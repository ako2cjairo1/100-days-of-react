import { useCallback, useEffect, useRef, useState } from 'react'
import cssModule from '../modules/HangMan.module.css'
import { TCategory, TLetter, TWords, WordDefinition } from '../types/HangMan.type'
import { formatFetchWords, getAlphabet, getRandom } from '../hangmanHelper'
import { useFetchWordsAsync } from '../hooks/useFetchWordsAsync'
import { Drawing, WordToGuess, Keyboard, StatusMessage, GameMenu, Hint, Progress } from '.'
import { Error, Loader } from './common'

const HangMan = () => {
	const { main, stats } = cssModule
	const [words, setWords] = useState<Array<WordDefinition>>([])
	const [keyboard, setKeyboard] = useState<TLetter[]>([])
	const [wordToGuess, setWordToGuess] = useState<WordDefinition>({ id: 0, word: '', info: '' })
	const [wrongGuessCounter, setWrongGuessCounter] = useState(0)
	const isInit = useRef(false)
	const isFetch = useRef(false)
	const [category, setCategory] = useState<TCategory>({})
	const [categoryName, setCategoryName] = useState('')
	const [isChangeCategory, setIsChangeCategory] = useState(true)
	const [progressList, setProgressList] = useState<TWords[]>([])

	const { fetchedWords, error, isDoneFetch, startFetch, clearFetchedWords } = useFetchWordsAsync({
		options: category,
	})

	useEffect(() => {
		if (fetchedWords.length && isDoneFetch && !words.length) {
			initFetchedWords()
		} else if (isInit.current && words.length) {
			handleStartGame()
		}

		// update progress every end of game
		if (isDone) {
			updateProgress()
		}

		const keyboardEventHandler = handleKeyboardEvent()

		return () => {
			document.removeEventListener('keypress', keyboardEventHandler)
		}
	}, [keyboard, words, isDoneFetch])

	const isSuccessfulGuess = keyboard.length
		? keyboard.filter(item => item.isCorrect).every(({ isGuessed }) => isGuessed)
		: false

	const isDone = isSuccessfulGuess || wrongGuessCounter >= 6

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

	const handleKeyboardEvent = () => {
		const createKeyboardEvent = (e: KeyboardEvent) => {
			e.preventDefault()

			if (e.key === 'Enter' && isDone) {
				handleStartGame()
			} else if (e.key.match(/^[A-Za-z]$/) && !isDone) {
				checkGuessedLetter(e.key)
			}
		}

		if (!isChangeCategory) {
			document.addEventListener('keypress', createKeyboardEvent)
		}

		// to allow inputting of category after end of game
		if (isDone && !words.length) {
			document.removeEventListener('keypress', createKeyboardEvent)
		}
		return createKeyboardEvent
	}

	const updateProgress = () => {
		const addProgress: TWords = {
			...wordToGuess,
			result: isSuccessfulGuess ? 'Win' : 'Lose',
		}

		setProgressList(prev => {
			const rest = [...prev.filter(itm => itm.id !== wordToGuess.id)]
			// calculate index to put the new result record
			let currentIdx = progressList.length - progressList.filter(itm => itm.result === '').length
			let end = rest[currentIdx]
			// swap values
			rest[currentIdx] = addProgress
			// return immediately if no value found
			if (end === undefined) return rest
			return [...rest, end]
		})
	}

	const initFetchedWords = () => {
		console.info('[Success fetch!]')
		const formattedWords = formatFetchWords(fetchedWords)
		setWords(formattedWords)
		setProgressList(
			formattedWords.map(item => {
				return {
					...item,
					result: '',
				}
			})
		)
		clearFetchedWords()
		isInit.current = true
		isFetch.current = true
	}

	const handleFetchWords = () => {
		setIsChangeCategory(false)
		setKeyboard([])
		startFetch.current = true
		isFetch.current = false
		setCategory({ category: categoryName, itemCount: 10 })
	}

	const handleStartGame = () => {
		if (words.length) {
			isInit.current = false
			setWrongGuessCounter(0)
			// get random item from words and convert to lowercase
			const initGuessingWord = getRandom(words)
			// remove the word-to-guess from the words list
			setWords(words.filter(item => item.word !== initGuessingWord.word))
			// initialize keyboard by marking the letters composing the word to guess
			const initLetters: TLetter[] = getAlphabet(true).map(letter => {
				return {
					letter: letter.toLowerCase(),
					// mark here
					isCorrect: initGuessingWord.word.includes(letter.toLowerCase()),
					isGuessed: false,
				}
			})
			setKeyboard(initLetters)
			setWordToGuess(initGuessingWord)
		}
	}

	const isLoading = !isChangeCategory && !isDoneFetch && !words.length

	return (
		<>
			{isLoading ? (
				<Loader />
			) : error ? (
				<Error message={error.message} />
			) : (
				<div className={main}>
					<Drawing {...{ isDone, wrongGuessCounter }} />
					{!isChangeCategory && (
						<>
							<div className={stats}>
								<StatusMessage {...{ cssModule, isSuccessfulGuess, wrongGuessCounter }} />
							</div>
							<WordToGuess
								wordToGuess={wordToGuess.word}
								{...{ cssModule, keyboard, isDone }}
							/>
							<Hint {...{ cssModule, category, wordToGuess, wrongGuessCounter, isDone }} />
						</>
					)}

					{!isChangeCategory && !isDone ? (
						<Keyboard
							disabled={isDone}
							letters={keyboard}
							handler={checkGuessedLetter}
						/>
					) : (
						<>
							{!isChangeCategory && isDone && <Progress {...{ cssModule, progressList }} />}
							<GameMenu
								isDone={isDone && words.length ? true : false}
								{...{
									setCategoryName,
									cssModule,
									category,
									categoryName,
									handleFetchWords,
									handleStartGame,
								}}
							/>
						</>
					)}
				</div>
			)}
		</>
	)
}

export default HangMan
