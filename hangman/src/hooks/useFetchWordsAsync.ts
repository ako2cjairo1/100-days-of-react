import { useEffect, useRef, useState } from 'react'
import { JSONResponse, WordDefinition } from '../types/HangMan.type'
import { fetchOptions, URL } from './config'

type UseFetchAsync = {
	url?: URL
	options?: {
		itemCount?: number
		category?: string
	}
}

export const useFetchWordsAsync = ({ url, options }: UseFetchAsync = {}) => {
	const [fetchedWords, setFetchedWords] = useState<Array<WordDefinition>>([])
	const [isDoneFetch, setIsDoneFetch] = useState<boolean>(false)
	const [error, setError] = useState<Error | null>(null)
	const startFetch = useRef(false)
	const [retryCount, setRetryCount] = useState(0)

	const createError = (err: Error) => {
		startFetch.current = false
		setError(err)
		setIsDoneFetch(true)
		setFetchedWords([])
	}

	const clearFetchedWords = () => {
		setFetchedWords([])
		return [...fetchedWords]
	}

	const fetchData = async ({ options }: UseFetchAsync) => {
		console.log('[Start Fetching]')
		startFetch.current = false
		setIsDoneFetch(false)

		const response = await fetch(url ? url : URL, fetchOptions(options))
		const { choices, errors }: JSONResponse = await response.json()
		if (response.ok) {
			if (choices && choices.length > 0) {
				try {
					const words: WordDefinition[] = JSON.parse(choices[0].text) // parse JSON using custom type

					setFetchedWords(words)
					setError(null)
					setIsDoneFetch(true)
				} catch (error) {
					const err = new Error(`Parsing failed! ${error} ${choices[0]}`)
					createError(err)
				}
			} else {
				const err = new Error('Parsing failed! There are no available choices.')
				createError(err)
			}
		} else {
			const err = new Error(errors?.map(e => e.message).join('\n') ?? 'unknown')
			createError(err)
		}
	}

	useEffect(() => {
		if (startFetch.current) {
			fetchData({ options })
		}

		if (error && retryCount <= 5) {
			const timeoutId = setTimeout(() => {
				setRetryCount(prev => prev + 1)
				fetchData({ options })
				clearTimeout(timeoutId)
			}, 3000)
		} else if (retryCount === 5) {
			createError(new Error('Maximum retries reached. Sorry!'))
		}
	}, [isDoneFetch, error, options])

	return { fetchedWords, clearFetchedWords, isDoneFetch, startFetch, error }
}
