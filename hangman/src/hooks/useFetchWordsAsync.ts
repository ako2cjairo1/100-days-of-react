import { useEffect, useRef, useState } from 'react'
import { JSONResponse, WordDictType } from '../types/HangMan.type'

export const useFetchWordsAsync = <T extends { method: string; headers: any; body: any }>(
	url: string,
	config?: T
) => {
	const [data, setData] = useState<WordDictType>([])
	const [isLoading, setIsLoading] = useState<boolean>(false)
	const [error, setError] = useState<Error | null>(null)
	const isFetch = useRef(true)
	const [retryCount, setRetryCount] = useState(0)

	useEffect(() => {
		const fetchData = async () => {
			isFetch.current = false
			console.log('Start Fetching...')
			setIsLoading(true)

			const response = await fetch(url, config)
			const { choices, errors }: JSONResponse = await response.json()

			if (response.ok) {
				if (choices && choices.length > 0) {
					const words: WordDictType = JSON.parse(choices[0].text) // convert to JSON

					setData(words)
					setError(null)
					console.log('Done Fetching')
					setIsLoading(false)
					isFetch.current = true
					return Promise.resolve(words)
				} else {
					const err = new Error('Parsing failed! There are no available choices.')
					setError(err)
					setIsLoading(false)
					isFetch.current = true

					return Promise.reject(err)
				}
			} else {
				const err = new Error(errors?.map(e => e.message).join('\n') ?? 'unknown')
				setError(err)
				setIsLoading(false)
				isFetch.current = true

				return Promise.reject(err)
			}
		}

		if (isFetch.current) {
			fetchData()
		}

		if (error && retryCount <= 3) {
			const timeoutId = setTimeout(() => {
				setRetryCount(prev => prev + 1)
				fetchData()
				clearTimeout(timeoutId)
			}, 3000)
		} else if (retryCount > 3) {
			console.warn('Maximum retries reached. Sorry!')
		}
	}, [url, config, error])

	return { data, isLoading, error }
}
