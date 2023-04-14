import { render } from '@/services/Utils/test.util'
import { Logo } from '../KeychainCard/Logo'

describe('Logo', () => {
	it('renders an img element if the logo prop is provided', () => {
		const { getByAltText } = render(
			<Logo
				logo="https://www.example.com/logo.png"
				website="example.com"
			/>
		)
		expect(getByAltText('E')).toBeInTheDocument()
	})

	it('renders an AnimatedIcon element if the logo prop is not provided', () => {
		const { getByText } = render(<Logo website="test.com" />)
		expect(getByText('T')).toBeInTheDocument()
	})
})
