import { ChangeEvent, FocusEvent, useState } from 'react'
import { TInputFocus } from '@/types'

const initFocus = {
	email: true,
	password: true,
	confirm: true,
} satisfies TInputFocus

/**
 * Custom hook to manage input states and focus events
 * @param {T} initState - Initial value for inputStates
 * @returns {Object} - Object containing resetInputState function and inputAttributes object
 */

export const useInput = <T>(initState: T) => {
	const [inputStates, setInputStates] = useState<T>(initState)
	const [inputFocus, setInputFocus] = useState<TInputFocus>(initFocus)

	// Resets inputStates and focusEvents to their initial values
	const resetInputState = () => {
		setInputStates(initState)
		setInputFocus(initFocus)
	}

	// Object containing inputStates, focusEvents and event handlers for onFocus, onBlur and onChange events
	const inputAttributes = {
		inputStates,
		inputFocus,
		onFocus: (e: FocusEvent<HTMLInputElement>) => null,
		onBlur: (e: FocusEvent<HTMLInputElement>) =>
			setInputFocus(prev => ({ ...prev, [e.target.id]: false })),
		onChange: (e: ChangeEvent<HTMLInputElement>) => {
			setInputStates(prev => ({ ...prev, [e.target.id]: e.target.value }))
			setInputFocus(prev => ({ ...prev, [e.target.id]: false }))
		},
	}

	return { resetInputState, inputAttributes }
}
