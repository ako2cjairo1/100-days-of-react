import { ChangeEvent, FocusEvent, useCallback, useEffect, useState } from 'react'
import { ConvertPropsToBool, Log } from '@/services/Utils/password-manager.helper'
import { useStateObj } from './useStateObj'

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
	const { objState: inputStates, mutate: setInputStates } = useStateObj<T>(initState)
	const { objState: isFocus, mutate: mutateIsFocus } = useStateObj<TUseInputFocus<T>>({})
	const [isSubmitted, setSubmit] = useState(false)

	// Resets inputStates and focusEvents to their initial values
	const resetInput = useCallback(
		(id?: string) => {
			// reset specific state using dynamic id as arg
			if (id) setInputStates({ [id]: '' })
			// reset all input state
			else setInputStates(initState)
			// initialize focus states to true
			mutateIsFocus(ConvertPropsToBool(initState, true))
		},
		[initState, setInputStates, mutateIsFocus]
	)

	const onChange = <T extends TInputEvent>(event: T) => {
		const { type, id, value, checked } = event.target
		// set the input state using id as key to set a value
		if (type === 'checkbox') {
			setInputStates({ [id]: checked })
		} else setInputStates({ [id]: value })

		// set the focus to false to trigger input validations
		mutateIsFocus({ [id]: false })
	}

	useEffect(() => {
		// used to create and initialize focus states to "true"
		mutateIsFocus(ConvertPropsToBool(initState, true))
	}, [initState, mutateIsFocus])

	// Object containing state and actions of this hook
	return {
		inputAction: {
			resetInput,
			submit: (value: boolean) => setSubmit(value),
			mutate: (update: Partial<T>) => setInputStates(update),
		},
		inputAttribute: {
			inputStates,
			isFocus,
			isSubmitted,
			onChange,
			onBlur: (event: TInputEvent) => mutateIsFocus({ [event.target.id]: false }),
			onFocus: (event: TInputEvent) => Log(`"${event.target.id}" focused`),
		},
	}
}
