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
		const { inputStates } = result.current.inputAttribute

		expect(inputStates).toEqual(initState)
	})

	it('should initialize inputFocus with default values to "true"', () => {
		const { result } = renderHook(() => useInput(initState))
		const { isFocus } = result.current.inputAttribute

		expect(isFocus).toEqual({
			email: true,
			password: true,
			confirm: true,
		})
	})

	it('should update inputStates onChange event', async () => {
		const { result } = renderHook(() => useInput(initState))
		const { onChange } = result.current.inputAttribute

		// invoke onChange events
		onChange(email)
		onChange(password)
		onChange(confirm)

		expect(result.current.inputAttribute.inputStates).toEqual({
			email: 'onChange test@example.com',
			password: 'onChange password123',
			confirm: 'onChange confirmPassword123',
		})
	})

	it('should update inputStates onBlur event', async () => {
		const { result } = renderHook(() => useInput(initState))
		const { onBlur } = result.current.inputAttribute

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

		expect(result.current.inputAttribute.isFocus).not.toEqual(initFocus)
	})

	it('should reset the "email" ONLY to initial value using "resetInput"', () => {
		const { result } = renderHook(() => useInput(initState))
		const { inputAttribute, inputAction } = result.current
		const { onChange } = inputAttribute

		// invoke onChange events
		onChange(email)
		onChange(password)
		onChange(confirm)

		expect(result.current.inputAttribute.inputStates).toEqual({
			email: 'onChange test@example.com',
			password: 'onChange password123',
			confirm: 'onChange confirmPassword123',
		})

		// trigger reset the "email"
		inputAction.resetInput('email')

		const { inputStates } = result.current.inputAttribute
		expect(inputStates).toEqual({ ...inputStates, email: '' })
	})

	it('should reset all inputStates to initial values using "resetInput"', () => {
		const { result } = renderHook(() => useInput(initState))
		const { inputAttribute, inputAction } = result.current
		const { onChange } = inputAttribute

		// invoke change events to mock update the inputStates
		onChange(email)
		onChange(password)
		onChange(confirm)

		const { inputStates } = result.current.inputAttribute
		expect(inputStates).toEqual({
			email: 'onChange test@example.com',
			password: 'onChange password123',
			confirm: 'onChange confirmPassword123',
		})

		// invoke reset
		inputAction.resetInput()

		expect(result.current.inputAttribute.inputStates).toEqual(initState)
	})

	it('should reset inputStates and inputFocus on "resetInput" call', () => {
		const { result } = renderHook(() => useInput(initState))
		const { inputAction } = result.current

		// invoke to reset all inputStates
		inputAction.resetInput()

		const { isFocus, inputStates } = result.current.inputAttribute
		expect(isFocus).toEqual(initFocus)
		expect(inputStates).toEqual(initState)
	})
})
