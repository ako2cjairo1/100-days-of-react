import { Description, Toggle } from '@/components'
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

	test('should render the description class', () => {
		const { getByTestId } = render(<Description>Test</Description>)
		const description = getByTestId('toggle-description')
		expect(description).toHaveClass('description')
	})

	test('should render the description-active class if checked is true', () => {
		const { getByTestId } = render(<Description checked>Test</Description>)
		const description = getByTestId('toggle-description')
		expect(description).toHaveClass('description-active')
	})

	test('should not render the description-active class if checked is false', () => {
		const { getByTestId } = render(<Description checked={false}>Test</Description>)
		const description = getByTestId('toggle-description')
		expect(description).not.toHaveClass('description-active')
	})
})
