import { TCredentials, TInputFocus } from '@/types/PasswordManager.type'
import { ChangeEvent, FocusEvent, useState } from 'react'

const initFocus = {
	email: true,
	password: true,
	confirm: true,
}

export const useInput = <TValue>(init: TValue) => {
	const [inputStates, setInputStates] = useState<TValue>(init)
	const [focusEvents, setFocusEvents] = useState<TInputFocus>(initFocus)

	const resetInputState = () => {
		setInputStates(init)
		setFocusEvents(initFocus)
	}

	const inputAttributes = {
		inputStates,
		focusEvents,
		onFocus: (e: FocusEvent<HTMLInputElement>) => null,
		// setFocusEvents(prev => ({ ...prev, [e.target.id]: false })),
		onBlur: (e: FocusEvent<HTMLInputElement>) =>
			setFocusEvents(prev => ({ ...prev, [e.target.id]: false })),
		onChange: (e: ChangeEvent<HTMLInputElement>) => {
			setInputStates(prev => ({ ...prev, [e.target.id]: e.target.value }))
			setFocusEvents(prev => ({ ...prev, [e.target.id]: false }))
		},
	}

	return { resetInputState, inputAttributes }
}
