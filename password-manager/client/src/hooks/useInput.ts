import { ChangeEvent, FocusEvent, useState } from 'react'
import { TConvertKeysOf, TCredentials } from '@/types'

const initFocus = {
	email: true,
	password: true,
	confirm: true,
} satisfies TConvertKeysOf<TCredentials, boolean>

/**
 * A custom hook that manages input states and focus events.
 *
 * @param {T} initState - The initial state of the input fields.
 *
 * @returns {Object} An object containing the `resetInputState` function and `inputAttributes` object.
 * The `resetInputState` function resets the input states and focus events to their initial values.
 * The `inputAttributes` object contains the current input states, focus events and event handlers for onFocus, onBlur and onChange events.
 */
export const useInput = <T extends TCredentials>(initState: T) => {
	const [inputStates, setInputStates] = useState<T>(initState)
	const [inputFocus, setInputFocus] = useState<
		{ [key: string]: boolean } | TConvertKeysOf<T, boolean>
	>(initFocus)

	// Resets inputStates and focusEvents to their initial values
	const resetInputState = (id?: string) => {
		let newInputState = initState
		if (id) {
			// reset the specific state using id arg
			newInputState = { ...inputStates, [id]: '' }
		}
		setInputStates(newInputState)
		setInputFocus(initFocus)
	}

	// Object containing inputStates, focusEvents and event handlers for onFocus, onBlur and onChange events
	const inputAttributes = {
		inputStates,
		inputFocus,
		onFocus: (e: FocusEvent<HTMLInputElement>) => console.log(`"${e.target.id}" focused`),
		onBlur: (e: FocusEvent<HTMLInputElement>) =>
			setInputFocus(prev => ({ ...prev, [e.target.id]: false })),
		onChange: (e: ChangeEvent<HTMLInputElement>) => {
			setInputStates(prev => ({ ...prev, [e.target.id]: e.target.value }))
			setInputFocus(prev => ({ ...prev, [e.target.id]: false }))
		},
	}

	return { resetInputState, inputAttributes }
}
