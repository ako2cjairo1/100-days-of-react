import { ChangeEvent, FocusEvent, useCallback, useEffect, useRef, useState } from 'react'
import { ConvertPropsToBool, Log } from '@/services/Utils/password-manager.helper'

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
	const [isSubmitted, setSubmit] = useState(false)
	const initFocus = useRef(true)

	// Resets inputStates and focusEvents to their initial values
	const resetInputState = useCallback(
		(id?: string) => {
			// reset specific state using id arg
			if (id) setInputStates(prev => ({ ...prev, [id]: '' }))
			// reset all input state
			else setInputStates(initState)

			setInputFocus(ConvertPropsToBool(initState, true)) // initialize focus states to true
		},
		[initState]
	)

	const handleChange = <T extends TInputEvent>(e: T) => {
		// set the input state using id as key to set a value
		if (e.target.type === 'checkbox') {
			setInputStates(prev => ({ ...prev, [e.target.id]: e.target.checked }))
		} else setInputStates(prev => ({ ...prev, [e.target.id]: e.target.value }))

		// set the focus to false to trigger input validations
		setInputFocus(prev => ({ ...prev, [e.target.id]: false }))
	}

	useEffect(() => {
		// used to create and initialize focus states to "true"
		if (initFocus.current) {
			setInputFocus(ConvertPropsToBool(initState, true)) // initialize focus states to true
			initFocus.current = false
		}
	}, [initState])

	// Object containing inputStates, focusEvents and event handlers for onFocus, onBlur and onChange events
	const inputAttributes = {
		inputStates,
		inputFocus,
		isSubmitted,
		submitForm: (isSubmit: boolean) => setSubmit(isSubmit),
		mutate: (state: T) => setInputStates(prev => ({ ...prev, ...state })),
		onChange: handleChange,
		onBlur: (e: TInputEvent) => setInputFocus(prev => ({ ...prev, [e.target.id]: false })),
		onFocus: (e: TInputEvent) => Log(`"${e.target.id}" focused`),
	}

	return { resetInputState, inputAttributes }
}
