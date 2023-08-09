import { ChangeEvent, FocusEvent, useEffect, useRef, useState } from 'react'
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
	const [input, mutateInput] = useStateObj<TInput>(initState)
	const [isFocus, mutateIsFocus] = useStateObj<TUseInputFocus<TInput>>({})
	const [isSubmitted, setSubmit] = useState(false)

	// create and initialize focus states to "true"
	const initFocusStates = () => mutateIsFocus(ConvertPropsToBool(initState, true))
	const initFocusStatesRef = useRef(initFocusStates)

	useEffect(() => initFocusStatesRef.current(), [])

	// Object containing states, action and event handlers
	return {
		input,
		isFocus,
		isSubmitted,
		// Resets input state and focus event to their initial values
		resetInput: (inputId?: keyof TInput) => {
			// set initial state of specific input using dynamic inputId
			if (inputId) mutateInput({ [inputId]: initState[inputId] })
			// reset all input state
			else mutateInput(initState)
			// initialize focus states to true
			initFocusStatesRef.current()
		},
		isSubmit: (value: boolean) => setSubmit(value),
		mutate: (update: Partial<TInput>) => mutateInput(update),
		onFocus: () => null,
		onBlur: (event: TInputEvent) => mutateIsFocus({ [event.target.id]: false }),
		// handles onChange event of input states (supports text: email, password and checkbox)
		onChange: <TEvent extends TInputEvent>(event: TEvent) => {
			const { type, id, value, checked } = event.target
			// set the input state using id as key to set a value
			if (type === 'checkbox') mutateInput({ [id]: checked })
			else mutateInput({ [id]: value })
			// set the focus to false to trigger input validations
			mutateIsFocus({ [id]: false })
		},
	}
}
