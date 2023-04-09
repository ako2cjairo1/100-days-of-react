import { RunAfterSomeTime } from '@/services/Utils/password-manager.helper'
import { useEffect, useState } from 'react'

export function useDelayToggle(toggle: boolean) {
	const [isFulfilled, setIsFulfilled] = useState(true)

	// use to delay animation of check icon (isFulfilled)
	useEffect(() => {
		if (toggle) {
			setIsFulfilled(true)

			RunAfterSomeTime(() => {
				setIsFulfilled(false)
			}, 3)
		}
	}, [toggle])

	return isFulfilled
}
