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

export function useInput<T>(initState: T) {
	const [inputStates, setInputStates] = useState<T>(initState)
	const [isFocus, setIsFocus] = useState<TUseInputFocus<T>>({})
	const [isSubmitted, setSubmit] = useState(false)
	const initFocus = useRef(true)

	// Resets inputStates and focusEvents to their initial values
	const resetInput = useCallback(
		(id?: string) => {
			// reset specific state using id arg
			if (id) setInputStates(prev => ({ ...prev, [id]: '' }))
			// reset all input state
			else setInputStates(initState)
			// initialize focus states to true
			setIsFocus(ConvertPropsToBool(initState, true))
		},
		[initState]
	)

	const onChange = <T extends TInputEvent>(e: T) => {
		// set the input state using id as key to set a value
		if (e.target.type === 'checkbox') {
			setInputStates(prev => ({ ...prev, [e.target.id]: e.target.checked }))
		} else setInputStates(prev => ({ ...prev, [e.target.id]: e.target.value }))

		// set the focus to false to trigger input validations
		setIsFocus(prev => ({ ...prev, [e.target.id]: false }))
	}

	useEffect(() => {
		// used to create and initialize focus states to "true"
		if (initFocus.current) {
			// initialize focus states to true
			setIsFocus(ConvertPropsToBool(initState, true))
			initFocus.current = false
		}
	}, [initState])

	// Object containing state and actions of this hook
	return {
		inputAction: {
			resetInput,
			submit: (value: boolean) => setSubmit(value),
			mutate: (state: Partial<T>) => setInputStates(prev => ({ ...prev, ...state })),
		},
		inputAttribute: {
			inputStates,
			isFocus,
			isSubmitted,
			onChange,
			onBlur: (e: TInputEvent) => setIsFocus(prev => ({ ...prev, [e.target.id]: false })),
			onFocus: (e: TInputEvent) => Log(`"${e.target.id}" focused`),
		},
	}
}
