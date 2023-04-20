import { act, renderHook } from '@testing-library/react-hooks'
import { useDebounceToggle } from '@/hooks'

describe('useDebounceToggle', () => {
	vi.useFakeTimers()

	it('should return the initial toggle value', () => {
		const { result } = renderHook(() => useDebounceToggle(true))
		expect(result.current).toBe(true)
	})

	it('should debounce the toggle value', async () => {
		const { result } = renderHook(({ toggle }) => useDebounceToggle(toggle), {
			initialProps: { toggle: true },
		})

		expect(result.current).toBe(true)

		await act(async () => {
			vi.advanceTimersByTime(3000)
		})
		expect(result.current).toBe(false)
	})
})
