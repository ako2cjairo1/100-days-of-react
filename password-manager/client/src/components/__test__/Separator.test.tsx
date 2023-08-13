import { Separator } from '@/components'
import { render } from '@/utils/test.util'

describe('Separator', () => {
	it('renders a separator without children', () => {
		const { container } = render(<Separator />)
		expect(container.firstChild).toHaveClass('separator')
		expect(container.querySelectorAll('span')).toHaveLength(2)
	})

	it('renders a separator with children', () => {
		const text = 'Hello World'
		const { container } = render(<Separator>{text}</Separator>)
		expect(container.firstChild).toHaveClass('separator')
		expect(container.querySelectorAll('span')).toHaveLength(2)
		expect(container.textContent).toBe(text)
	})
})
