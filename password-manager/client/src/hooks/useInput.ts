import { TCredentials, TInputFocus } from '@/types/PasswordManager.type'
import { ChangeEvent, FocusEvent, useState } from 'react'

export const useInput = <TValue>(init: TValue) => {
	const [inputStates, setInputStates] = useState<TValue>(init)
	const [focusEvents, setFocusEvents] = useState<TInputFocus>({
		email: true,
		password: true,
		confirm: true,
	})

	const resetInputState = () => setInputStates(init)

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
