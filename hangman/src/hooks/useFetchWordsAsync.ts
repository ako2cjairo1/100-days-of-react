import { useEffect, useRef, useState } from 'react'
import { executeAfterSomeTime } from '../hangmanHelper'
import { JSONResponse, WordDefinition } from '../types/HangMan.type'
import { fetchOptions, URL } from './config'

type UseFetchAsync<T> = {
	url?: URL
	options?: T
}

export const useFetchWordsAsync = <T>({ url, options }: UseFetchAsync<T> = {}) => {
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

	const fetchData = async ({ options }: UseFetchAsync<T>) => {
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
					createError(new Error(`Parsing failed! ${error} ${choices[0]}`))
				}
			} else {
				createError(new Error('Parsing failed! There are no available choices.'))
			}
		} else {
			createError(new Error(errors?.map(e => e.message).join('\n') ?? 'unknown'))
		}
	}

	useEffect(() => {
		if (startFetch.current) {
			fetchData({ options })
		}

		if (error && retryCount <= 5) {
			executeAfterSomeTime(() => {
				setRetryCount(prev => prev + 1)
				fetchData({ options })
			}, 3)
		} else if (retryCount === 5) {
			createError(new Error('Maximum retries reached. Sorry!'))
		}
	}, [error, options, startFetch.current])

	return { fetchedWords, clearFetchedWords, isDoneFetch, startFetch, error }
}
