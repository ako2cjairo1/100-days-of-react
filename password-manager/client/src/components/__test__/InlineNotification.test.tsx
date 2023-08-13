import { InlineNotification } from '@/components'
import { render } from '@/utils/test.util'

describe('InlineNotification', () => {
	it('renders the children prop correctly', () => {
		const { getByText } = render(<InlineNotification>Test</InlineNotification>)
		expect(getByText('Test')).toBeInTheDocument()
	})

	it('renders the default icon when iconName is not provided', () => {
		const { getByTestId } = render(<InlineNotification>Test</InlineNotification>)
		expect(getByTestId('animated-icon')).toHaveClass('fa fa-info-circle')
	})

	it('renders the provided iconName when it is provided', () => {
		const { getByTestId } = render(
			<InlineNotification iconName="fa fa-circle-check">Test</InlineNotification>
		)
		expect(getByTestId('animated-icon')).toHaveClass('fa fa-circle-check')
	})
})
