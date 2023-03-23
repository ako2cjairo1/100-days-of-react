import { ChangeEvent, FocusEvent, useEffect, useState } from 'react'
import { ConvertPropsToBool } from '@/services/Utils/password-manager.helper'

/**
 * A custom hook that manages input states and focus events.
 *
 * @param {T} initState - The initial state of the input fields.
 *
 * @returns {Object} An object containing the `resetInputState` function and `inputAttributes` object.
 * The `resetInputState` function resets the input states and focus events to their initial values.
 * The `inputAttributes` object contains the current input states, focus events and event handlers for onFocus, onBlur and onChange events.
 */
type TUseInputFocus<T> = Record<keyof T, boolean> | { [key: string]: boolean }

export const useInput = <T>(initState: T) => {
	const [inputStates, setInputStates] = useState<T>(initState)
	const [inputFocus, setInputFocus] = useState<TUseInputFocus<T>>({})

	useEffect(() => {
		// used to create and initialize focus states to "true"
		resetInputState()
	}, [])

	// Resets inputStates and focusEvents to their initial values
	const resetInputState = (id?: string) => {
		let newInputState = initState
		if (id) {
			// reset the specific state using id arg
			newInputState = { ...inputStates, [id]: '' }
		}
		setInputStates(newInputState)
		setInputFocus(ConvertPropsToBool(initState, true)) // initialize focus states to true
	}

	// Object containing inputStates, focusEvents and event handlers for onFocus, onBlur and onChange events
	const inputAttributes = {
		inputStates,
		inputFocus,
		onFocus: (e: FocusEvent<HTMLInputElement>) => console.log(`"${e.target.id}" focused`),
		onBlur: (e: FocusEvent<HTMLInputElement>) =>
			setInputFocus(prev => ({ ...prev, [e.target.id]: false })),
		onChange: (e: ChangeEvent<HTMLInputElement>) => {
			// set the input state using id as key to set a value
			setInputStates(prev => ({ ...prev, [e.target.id]: e.target.value }))
			// set the focus to false to trigger input validations
			setInputFocus(prev => ({ ...prev, [e.target.id]: false }))
		},
	}

	return { resetInputState, inputAttributes }
}
