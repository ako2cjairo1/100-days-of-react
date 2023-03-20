import { renderHook } from '@testing-library/react-hooks'
import { useInput } from '@/hooks/useInput'
import { ChangeEvent, FocusEvent } from 'react'

describe('useInput', () => {
	const initValue = { email: '', password: '', confirm: '' }

	it('should initialize inputStates with provided init value', () => {
		const { result } = renderHook(() => useInput(initValue))
		const { inputStates } = result.current.inputAttributes

		expect(inputStates).toEqual(initValue)
	})

	it('should initialize inputFocus with default values to "true"', () => {
		const { result } = renderHook(() => useInput(initValue))
		const { inputFocus } = result.current.inputAttributes

		expect(inputFocus).toEqual({
			email: true,
			password: true,
			confirm: true,
		})
	})

	it('should update inputStates (of email) on onChange event', () => {
		const { result } = renderHook(() => useInput(initValue))
		const { onChange } = result.current.inputAttributes

		const mockEvent = {
			target: {
				id: 'email',
				value: 'test@example.com',
				addEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
				removeEventListener: vi.fn(),
			},
		} as unknown as ChangeEvent<HTMLInputElement>

		// invoke the onChange event for 'email'
		onChange(mockEvent)

		const { email } = result.current.inputAttributes.inputStates
		expect(email).toBe('test@example.com')
	})

	it('should update inputFocus (of password) on onBlur event', () => {
		const { result } = renderHook(() => useInput(initValue))
		const { onBlur } = result.current.inputAttributes

		const mockEvent = {
			target: {
				id: 'password',
				addEventListener: vi.fn(),
				dispatchEvent: vi.fn(),
				removeEventListener: vi.fn(),
			},
		} as unknown as FocusEvent<HTMLInputElement>

		// invoke onBlur event for 'password'
		onBlur(mockEvent)

		const { password } = result.current.inputAttributes.inputFocus
		expect(password).toBe(false)
	})

	it('should reset inputStates and inputFocus on resetInputState call', () => {
		const initFocus = { email: true, password: true, confirm: true }
		const { result } = renderHook(() => useInput(initValue))
		const { resetInputState } = result.current

		// invoke resetInputState function
		resetInputState()

		const { inputFocus, inputStates } = result.current.inputAttributes
		expect(inputFocus).toEqual(initFocus)
		expect(inputStates).toEqual(initValue)
	})
})
