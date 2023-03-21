import { renderHook } from '@testing-library/react-hooks'
import { useInput } from '@/hooks/useInput'
import { ChangeEvent, FocusEvent } from 'react'
import { OverrideEventTarget } from '@/services/Utils/password-manager.helper'

describe('useInput', () => {
	const initState = { email: '', password: '', confirm: '' }
	const initFocus = { email: true, password: true, confirm: true }

	const email = OverrideEventTarget<ChangeEvent<HTMLInputElement>>({
		id: 'email',
		value: 'onChange test@example.com',
	})
	const password = OverrideEventTarget<ChangeEvent<HTMLInputElement>>({
		id: 'password',
		value: 'onChange password123',
	})
	const confirm = OverrideEventTarget<ChangeEvent<HTMLInputElement>>({
		id: 'confirm',
		value: 'onChange confirmPassword123',
	})

	it('should initialize inputStates with provided init value', () => {
		const { result } = renderHook(() => useInput(initState))
		const { inputStates } = result.current.inputAttributes

		expect(inputStates).toEqual(initState)
	})

	it('should initialize inputFocus with default values to "true"', () => {
		const { result } = renderHook(() => useInput(initState))
		const { inputFocus } = result.current.inputAttributes

		expect(inputFocus).toEqual({
			email: true,
			password: true,
			confirm: true,
		})
	})

	it('should update inputStates onChange event', async () => {
		const { result } = renderHook(() => useInput(initState))
		const { onChange } = result.current.inputAttributes

		// invoke onChange events
		onChange(email)
		onChange(password)
		onChange(confirm)

		expect(result.current.inputAttributes.inputStates).toEqual({
			email: 'onChange test@example.com',
			password: 'onChange password123',
			confirm: 'onChange confirmPassword123',
		})
	})

	it('should update inputStates onBlur event', async () => {
		const { result } = renderHook(() => useInput(initState))
		const { onBlur } = result.current.inputAttributes

		const email = OverrideEventTarget<FocusEvent<HTMLInputElement>>({
			id: 'email',
			value: false,
		})
		const password = OverrideEventTarget<FocusEvent<HTMLInputElement>>({
			id: 'password',
			value: false,
		})
		const confirm = OverrideEventTarget<FocusEvent<HTMLInputElement>>({
			id: 'confirm',
			value: false,
		})

		// invoke on onBlur events
		onBlur(email)
		onBlur(password)
		onBlur(confirm)

		expect(result.current.inputAttributes.inputFocus).not.toEqual(initFocus)
	})

	it('should reset the "email" ONLY to initial value using "resetInputState"', () => {
		const { result } = renderHook(() => useInput(initState))
		const { inputAttributes, resetInputState } = result.current
		const { onChange } = inputAttributes

		// invoke onChange events
		onChange(email)
		onChange(password)
		onChange(confirm)

		expect(result.current.inputAttributes.inputStates).toEqual({
			email: 'onChange test@example.com',
			password: 'onChange password123',
			confirm: 'onChange confirmPassword123',
		})

		// trigger reset the "email"
		resetInputState('email')

		const { inputStates } = result.current.inputAttributes
		expect(inputStates).toEqual({ ...inputStates, email: '' })
	})

	it('should reset all inputStates to initial values using "resetInputState"', () => {
		const { result } = renderHook(() => useInput(initState))
		const { inputAttributes, resetInputState } = result.current
		const { onChange } = inputAttributes

		// invoke change events to mock update the inputStates
		onChange(email)
		onChange(password)
		onChange(confirm)

		const { inputStates } = result.current.inputAttributes
		expect(inputStates).toEqual({
			email: 'onChange test@example.com',
			password: 'onChange password123',
			confirm: 'onChange confirmPassword123',
		})

		// invoke reset
		resetInputState()

		expect(result.current.inputAttributes.inputStates).toEqual(initState)
	})

	it('should reset inputStates and inputFocus on "resetInputState" call', () => {
		const { result } = renderHook(() => useInput(initState))
		const { resetInputState } = result.current

		// invoke to reset all inputStates
		resetInputState()

		const { inputFocus, inputStates } = result.current.inputAttributes
		expect(inputFocus).toEqual(initFocus)
		expect(inputStates).toEqual(initState)
	})
})
