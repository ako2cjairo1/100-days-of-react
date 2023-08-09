import { renderHook, act } from '@testing-library/react-hooks'
import { useStateObj } from '@/hooks/useStateObj'

describe('useStateObj', () => {
	test('should update the state using the mutate function', () => {
		const { result } = renderHook(() => useStateObj({ a: 1, b: 2 }))
		const mutateFn = result.current[1]

		act(() => {
			mutateFn({ b: 3 })
		})

		expect(result.current[0]).toEqual({ a: 1, b: 3 })
	})

	test('should not update the state if the update object is empty', () => {
		const { result } = renderHook(() => useStateObj({ a: 1, b: 2 }))
		const mutateFn = result.current[1]

		act(() => {
			mutateFn({})
		})

		expect(result.current[0]).toEqual({ a: 1, b: 2 })
	})

	test('should add new properties to the state using the mutate function', () => {
		const { result } = renderHook(() => useStateObj({ a: 1, b: 2 }))
		const mutateFn = result.current[1]

		act(() => {
			mutateFn({ c: 3 })
		})

		expect(result.current[0]).toEqual({ a: 1, b: 2, c: 3 })
	})
})
