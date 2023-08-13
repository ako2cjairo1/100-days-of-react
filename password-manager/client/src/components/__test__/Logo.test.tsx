import { render } from '@/utils/test.util'
import { CardLogo } from '@/components'

describe('Logo', () => {
	it('renders an img element if the logo prop is provided', () => {
		const { getByAltText } = render(
			<CardLogo
				logo="https://www.example.com/logo.png"
				website="example.com"
			/>
		)
		expect(getByAltText('E')).toBeInTheDocument()
	})

	it('renders an AnimatedIcon element if the logo prop is not provided', () => {
		const { getByText } = render(<CardLogo website="test.com" />)
		expect(getByText('T')).toBeInTheDocument()
	})
})
