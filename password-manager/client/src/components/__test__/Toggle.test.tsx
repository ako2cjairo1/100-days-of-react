import { Toggle } from '@/components'
import { fireEvent, render } from '@/services/Utils/test.util'

describe('Toggle', () => {
	it('renders a checkbox input', () => {
		const { getByRole } = render(<Toggle id="toggle" />)
		expect(getByRole('checkbox')).toBeInTheDocument()
	})

	it('toggles when clicked', () => {
		const { getByRole } = render(<Toggle id="toggle" />)
		const checkbox = getByRole('checkbox')
		expect(checkbox).not.toBeChecked()
		fireEvent.click(checkbox)
		expect(checkbox).toBeChecked()
	})
})
