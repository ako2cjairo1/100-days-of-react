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
type TInputEvent = FocusEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>

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

	const handleChange = <T extends TInputEvent>(e: T) => {
		// set the input state using id as key to set a value
		if (e.target.type === 'checkbox') {
			setInputStates(prev => ({ ...prev, [e.target.id]: e.target.checked }))
		} else setInputStates(prev => ({ ...prev, [e.target.id]: e.target.value }))

		// set the focus to false to trigger input validations
		setInputFocus(prev => ({ ...prev, [e.target.id]: false }))
	}

	// Object containing inputStates, focusEvents and event handlers for onFocus, onBlur and onChange events
	const inputAttributes = {
		inputStates,
		inputFocus,
		setInputStates,
		onChange: handleChange,
		onFocus: (e: TInputEvent) => {}, //console.log(`"${e.target.id}" focused`),
		onBlur: (e: TInputEvent) => setInputFocus(prev => ({ ...prev, [e.target.id]: false })),
	}

	return { resetInputState, inputAttributes }
}
