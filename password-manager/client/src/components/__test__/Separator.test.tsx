import { Separator } from '@/components'
import { render } from '@/services/Utils/test.util'

describe('Separator', () => {
	it('renders a separator without children', () => {
		const { container } = render(<Separator />)
		expect(container.firstChild).toHaveClass('separator small')
		expect(container.querySelectorAll('.line')).toHaveLength(1)
	})

	it('renders a separator with children', () => {
		const text = 'Hello World'
		const { container } = render(<Separator>{text}</Separator>)
		expect(container.firstChild).toHaveClass('separator small')
		expect(container.querySelectorAll('.line')).toHaveLength(2)
		expect(container.textContent).toBe(text)
	})
})
