import { RunAfterSomeTime } from '@/services/Utils/password-manager.helper'
import { useEffect, useState } from 'react'

/**
 * This hook returns a boolean value that indicates whether the toggle has been fulfilled or not.
 * It takes in two arguments: toggle and delay.
 * param {boolean} toggle - A boolean value that indicates whether the toggle should be fulfilled or not.
 * param {number} [delay=3] - An optional number value that specifies the delay in seconds before the toggle is fulfilled.
 * returns {boolean} Returns a boolean value that indicates whether the toggle has been fulfilled or not.
 */

export function useDebounceToggle(toggle: boolean, delay = 3) {
	const [toggleValue, setToggleValue] = useState(toggle)

	useEffect(() => {
		// flip the toggle
		RunAfterSomeTime(() => setToggleValue(!toggle), delay)
	}, [toggle, delay])

	return toggleValue
}
