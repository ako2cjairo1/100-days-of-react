import { useEffect, useRef, useState } from 'react'
import { JSONResponse, WordDefinition } from '../types/HangMan.type'

export const useFetchWordsAsync = <T extends { method: string; headers: any; body: any }>(
	url: string,
	config?: T
) => {
	const [data, setData] = useState<Array<WordDefinition>>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<Error | null>(null)
	const isFetch = useRef(true)
	const [retryCount, setRetryCount] = useState(0)

	const createError = (err: Error) => {
		isFetch.current = false
		setError(err)
		setIsLoading(false)
		setData([])
	}

	const fetchData = async () => {
		isFetch.current = false
		setIsLoading(true)

		const response = await fetch(url, config)
		const { choices, errors }: JSONResponse = await response.json()
		if (response.ok) {
			if (choices && choices.length > 0) {
				try {
					const words: WordDefinition[] = JSON.parse(choices[0].text) // parse JSON using custom type

					setData(words)
					setError(null)
					setIsLoading(false)
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
		if (isFetch.current) {
			fetchData()
		}

		if (error && retryCount <= 5) {
			const timeoutId = setTimeout(() => {
				setRetryCount(prev => prev + 1)
				fetchData()
				clearTimeout(timeoutId)
			}, 3000)
		} else if (retryCount === 5) {
			createError(new Error('Maximum retries reached. Sorry!'))
		}
	}, [isLoading, error])

	return { data, isLoading, error }
}
