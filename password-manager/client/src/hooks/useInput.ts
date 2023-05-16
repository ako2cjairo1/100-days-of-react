import { ChangeEvent, FocusEvent, useCallback, useEffect, useState } from 'react'
import { ConvertPropsToBool } from '@/services/Utils'
import { useStateObj } from '@/hooks'

/**
 * A custom hook that manages input states and focus events.
 *
 * param {T} initState - The initial state of the input fields.
 *
 * returns {Object} An object containing the `resetInput` function and `inputAttribute` object.
 * The `inputAction` function to resets the input states to their initial values, submit and mutate actions.
 * The `inputAttribute` object contains the current input states, focus events and event handlers for onFocus, onBlur and onChange events.
 */
type TUseInputFocus<T> = Record<keyof T, boolean> | { [key: string]: boolean }
type TInputEvent = FocusEvent<HTMLInputElement> | ChangeEvent<HTMLInputElement>

export function useInput<TInput>(initState: TInput) {
	const { objState: inputStates, mutate: setInputStates } = useStateObj<TInput>(initState)
	const { objState: isFocus, mutate: mutateIsFocus } = useStateObj<TUseInputFocus<TInput>>({})
	const [isSubmitted, setSubmit] = useState(false)

	// used to create and initialize focus states to "true"
	const initFocusStates = useCallback(
		() => mutateIsFocus(ConvertPropsToBool(initState, true)),
		[initState, mutateIsFocus]
	)

	useEffect(() => {
		initFocusStates()
	}, [initFocusStates])

	// Resets inputStates and focusEvents to their initial values
	const resetInput = useCallback(
		(inputId?: keyof TInput) => {
			// set initial state of specific input using dynamic inputId
			if (inputId) setInputStates({ [inputId]: initState[inputId] })
			// reset all input state
			else setInputStates(initState)
			// initialize focus states to true
			initFocusStates()
		},
		[setInputStates, initState, initFocusStates]
	)

	// handles onChange event of input states (supports text: email, password and checkbox)
	const onChange = <TEvent extends TInputEvent>(event: TEvent) => {
		const { type, id, value, checked } = event.target

		// set the input state using id as key to set a value
		if (type === 'checkbox') {
			setInputStates({ [id]: checked })
		} else setInputStates({ [id]: value })

		// set the focus to false to trigger input validations
		mutateIsFocus({ [id]: false })
	}

	// Object containing actions and states of this hook
	return {
		inputAction: {
			resetInput,
			isSubmit: (value: boolean) => setSubmit(value),
			mutate: (update: Partial<TInput>) => setInputStates(update),
		},
		inputAttribute: {
			inputStates,
			isFocus,
			isSubmitted,
			onChange,
			onBlur: (event: TInputEvent) => mutateIsFocus({ [event.target.id]: false }),
			onFocus: () => null, //Log(`"${event.target.id}" focused`),
		},
	}
}
