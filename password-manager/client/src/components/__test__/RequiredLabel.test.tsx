import { RequiredLabel } from '@/components'
import { render } from '@/services/Utils/test.util'
import { act } from 'react-dom/test-utils'

describe('RequiredLabel', () => {
	it('should render a label element with given htmlFor and text', () => {
		const { getByText } = render(
			<RequiredLabel
				labelFor="example"
				label="Example Label"
			/>
		)
		expect(getByText('Example Label')).toHaveAttribute('for', 'example')
	})

	it('renders a "(required)" indicator when isOptional prop is unset/false', () => {
		const { getByText } = render(
			<RequiredLabel
				labelFor="example"
				label="Test Label"
				subLabel="Test Sub-Label"
				isOptional={false}
			/>
		)

		expect(getByText('Test Sub-Label (required)')).toBeInTheDocument()
	})

	it('does not render a "(required)" indicator when isOptional prop is true', () => {
		const { queryByText } = render(
			<RequiredLabel
				labelFor="example"
				label="Test Label"
				subLabel="Test Sub-Label"
				isOptional={true}
			/>
		)

		expect(queryByText('(required)')).not.toBeInTheDocument()
	})

	it('does not render a required indicator when isFulfilled prop is true', () => {
		const { queryByText } = render(
			<RequiredLabel
				labelFor="example"
				label="Test Label"
				subLabel="Test Sub-Label"
				isFulfilled={true}
			/>
		)

		expect(queryByText('(required)')).not.toBeInTheDocument()
	})

	it('should render sub-label when given', () => {
		const { getByText } = render(
			<RequiredLabel
				labelFor="example"
				label="Example Label"
				subLabel="Example Sub-label"
			/>
		)
		expect(getByText('Example Sub-label (required)')).toBeInTheDocument()
	})

	it('should render "(required)" text when isFulfilled prop is false or undefined', () => {
		const { getByText } = render(
			<RequiredLabel
				labelFor="example"
				label="Example Label"
				subLabel="Example Sub-label"
			/>
		)
		expect(getByText('Example Sub-label (required)')).toBeInTheDocument()
	})

	it('should not render "(required)" text when isFulfilled prop is true', () => {
		const { queryByText } = render(
			<RequiredLabel
				labelFor="example"
				label="Example Label"
				subLabel="Example Sub-label"
				isFulfilled={true}
			/>
		)
		expect(queryByText('Example Sub-label (required)')).not.toBeInTheDocument()
	})

	it('should render check icon when isFulfilled prop is true', () => {
		const { container } = render(
			<RequiredLabel
				labelFor="example"
				label="Example Label"
				subLabel="Example Sub-label"
				isFulfilled={true}
			/>
		)
		expect(container.querySelector('.fa.fa-check')).toBeInTheDocument()
	})

	it('should hide check icon after 3s when isFulfilled prop is true', async () => {
		vi.useFakeTimers()
		const { container } = render(
			<RequiredLabel
				labelFor="example"
				label="Example Label"
				subLabel="Example Sub-label"
				isFulfilled={true}
			/>
		)
		await act(async () => {
			vi.advanceTimersByTime(3000)
		})
		expect(container.querySelector('.fa.fa-check')).not.toBeInTheDocument()
	})
})
