import { renderHook, act } from '@testing-library/react-hooks'
import { useStateObj } from '@/hooks/useStateObj'

describe('useStateObj', () => {
	test('should update the state using the mutate function', () => {
		const { result } = renderHook(() => useStateObj({ a: 1, b: 2 }))
		const { mutate } = result.current

		act(() => {
			mutate({ b: 3 })
		})

		expect(result.current.objState).toEqual({ a: 1, b: 3 })
	})

	test('should not update the state if the update object is empty', () => {
		const { result } = renderHook(() => useStateObj({ a: 1, b: 2 }))
		const { mutate } = result.current

		act(() => {
			mutate({})
		})

		expect(result.current.objState).toEqual({ a: 1, b: 2 })
	})

	// test('should add new properties to the state using the mutate function', () => {
	// 	const { result } = renderHook(() => useStateObj({ a: 1, b: 2 }))
	// 	const { mutate } = result.current

	// 	act(() => {
	// 		mutate({ c: 3 })
	// 	})

	// 	expect(result.current.objState).toEqual({ a: 1, b: 2, c: 3 })
	// })
})
