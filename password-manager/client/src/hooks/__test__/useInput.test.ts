import { ChangeEvent, FocusEvent } from 'react'
import { renderHook } from '@testing-library/react-hooks'
import { useInput } from '@/hooks'
import { OverrideEventTarget } from '@/utils'

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
		const { input } = result.current

		expect(input).toEqual(initState)
	})

	it('should initialize inputFocus with default values to "true"', () => {
		const { result } = renderHook(() => useInput(initState))
		const { isFocus } = result.current

		expect(isFocus).toEqual({
			email: true,
			password: true,
			confirm: true,
		})
	})

	it('should update inputStates onChange event', async () => {
		const { result } = renderHook(() => useInput(initState))
		const { onChange } = result.current

		// invoke onChange events
		onChange(email)
		onChange(password)
		onChange(confirm)

		expect(result.current.input).toEqual({
			email: 'onChange test@example.com',
			password: 'onChange password123',
			confirm: 'onChange confirmPassword123',
		})
	})

	it('should update inputStates onBlur event', async () => {
		const { result } = renderHook(() => useInput(initState))
		const { onBlur } = result.current

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

		expect(result.current.isFocus).not.toEqual(initFocus)
	})

	it('should reset the "email" ONLY to initial value using "resetInput"', () => {
		const { result } = renderHook(() => useInput(initState))
		const { resetInput, onChange } = result.current

		// invoke onChange events
		onChange(email)
		onChange(password)
		onChange(confirm)

		expect(result.current.input).toEqual({
			email: 'onChange test@example.com',
			password: 'onChange password123',
			confirm: 'onChange confirmPassword123',
		})

		// trigger reset the "email"
		resetInput('email')

		const { input } = result.current
		expect(input).toEqual({ ...input, email: '' })
	})

	it('should reset all inputStates to initial values using "resetInput"', () => {
		const { result } = renderHook(() => useInput(initState))
		const { resetInput, onChange } = result.current

		// invoke change events to mock update the inputStates
		onChange(email)
		onChange(password)
		onChange(confirm)

		const { input } = result.current
		expect(input).toEqual({
			email: 'onChange test@example.com',
			password: 'onChange password123',
			confirm: 'onChange confirmPassword123',
		})

		// invoke reset
		resetInput()

		expect(result.current.input).toEqual(initState)
	})

	it('should reset inputStates and inputFocus on "resetInput" call', () => {
		const { result } = renderHook(() => useInput(initState))
		const { resetInput } = result.current

		// invoke to reset all inputStates
		resetInput()

		const { isFocus, input } = result.current
		expect(isFocus).toEqual(initFocus)
		expect(input).toEqual(initState)
	})
})
