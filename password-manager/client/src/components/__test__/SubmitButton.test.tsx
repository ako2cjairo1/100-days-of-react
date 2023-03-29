import { SubmitButton } from '@/components'
import { render, fireEvent } from '@/services/Utils/test.util'

describe('SubmitButton', () => {
	it('renders with custom text', () => {
		const text = 'Custom Text'
		const { getByRole } = render(<SubmitButton submitted={false}>{text}</SubmitButton>)
		expect(getByRole('button')).toHaveTextContent(text)
	})

	it('renders with an icon if iconName prop is provided', () => {
		const iconName = 'fa-check'
		const { getByTestId } = render(
			<SubmitButton
				submitted={false}
				{...{ iconName }}
			/>
		)
		expect(getByTestId(iconName)).toBeInTheDocument()
	})

	it('renders "spinner" if submitted prop is true', () => {
		const { getByTestId } = render(<SubmitButton submitted={true} />)
		expect(getByTestId('spinner')).toBeInTheDocument()
	})

	it('calls onClick when clicked with given button text (children)', async () => {
		const onClick = vi.fn()
		const buttonText = 'Click me'

		const { getByText } = render(
			<SubmitButton
				onClick={onClick}
				submitted={false}
			>
				{buttonText}
			</SubmitButton>
		)

		await fireEvent.click(getByText(buttonText))
		expect(onClick).toHaveBeenCalled()
	})
})
