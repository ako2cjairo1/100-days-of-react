import { LinkLabel } from '@/components'
import { render, fireEvent } from '@/services/Utils/test.util'
import { MemoryRouter } from 'react-router-dom'

describe('LinkLabel', () => {
	const props = {
		routeTo: '/test-route',
		preText: 'Test pre-text',
		children: 'Click me!',
	}

	it('should render correctly with required props "preText" and "routeTo", optional "children"', () => {
		const { getByText } = render(
			<MemoryRouter>
				<LinkLabel {...props}>{props.children}</LinkLabel>
			</MemoryRouter>
		)

		expect(getByText(props.preText)).toBeInTheDocument()
		expect(getByText(props.children)).toBeInTheDocument()
		expect(getByText(props.children)).toHaveAttribute('href', props.routeTo)
	})

	// TODO: mock the navigation onClick action
	it('calls onClick when clicked', async () => {
		const mockOnClick = vi.fn()
		const { getByText } = render(
			<MemoryRouter>
				<LinkLabel
					{...props}
					onClick={mockOnClick('onClick success')}
				>
					{props.children}
				</LinkLabel>
			</MemoryRouter>
		)

		await fireEvent.click(getByText(props.children))
		expect(mockOnClick).toHaveBeenCalledWith('onClick success')
	})
})
