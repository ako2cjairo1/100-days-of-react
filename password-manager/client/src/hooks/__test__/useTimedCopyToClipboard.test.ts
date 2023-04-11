import { renderHook } from '@testing-library/react-hooks'
import { useTimedCopyToClipboard } from '@/hooks/useTimedCopyToClipboard'

describe('useTimedCopyToClipboard', () => {
	it('should copy text to clipboard and set isCopied=true and statusMessage=Copied to clipboard!', () => {
		const { result } = renderHook(() =>
			useTimedCopyToClipboard({
				text: 'test',
				expiration: 1,
			})
		)

		result.current.copy()

		expect(result.current.isCopied).toBe(true)
		expect(result.current.statusMessage).toBe('Copied to clipboard!')
	})

	it('should clear text to clipboard and reset the state', () => {
		const { result } = renderHook(() =>
			useTimedCopyToClipboard({
				text: 'test',
			})
		)

		result.current.clear()
		expect(result.current.isCopied).toBe(false)
		expect(result.current.statusMessage).toBe('')
	})
})
