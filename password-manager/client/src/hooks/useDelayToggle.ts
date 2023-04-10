import { RunAfterSomeTime } from '@/services/Utils/password-manager.helper'
import { useEffect, useState } from 'react'

export function useDebounceToggle(toggle: boolean, delay?: number) {
	const [isFulfilled, setIsFulfilled] = useState(true)

	// use to delay animation of check icon (isFulfilled)
	useEffect(() => {
		if (toggle) {
			setIsFulfilled(true)

			RunAfterSomeTime(() => {
				setIsFulfilled(false)
			}, delay || 3)
		}
	}, [toggle, delay])

	return isFulfilled
}
