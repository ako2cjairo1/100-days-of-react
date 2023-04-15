import { fireEvent, render } from '@/services/Utils/test.util'
import { MemoryRouter } from 'react-router-dom'
import { KeychainCard, Logo } from '@/components/KeychainCard'

describe('KeychainCard', () => {
	it('renders the website domain name and subText', () => {
		const { getByText } = render(
			<MemoryRouter>
				<KeychainCard
					website="https://www.example.com"
					subText="subText"
				/>
			</MemoryRouter>
		)
		expect(getByText('example.com')).toBeInTheDocument()
		expect(getByText('subText')).toBeInTheDocument()
	})

	it('calls the onClick function when clicked', () => {
		const onClick = vi.fn()
		const { getByTestId } = render(
			<MemoryRouter>
				<KeychainCard
					website="https://www.example.com"
					onClick={onClick}
				/>
			</MemoryRouter>
		)
		fireEvent.click(getByTestId('keychain-card-link'))
		expect(onClick).toHaveBeenCalled()
	})
})

describe('Logo', () => {
	it('renders an img element with the provided logo', () => {
		const { getByAltText } = render(
			<Logo
				logo="logo.png"
				website="example.com"
			/>
		)
		expect(getByAltText('E')).toHaveAttribute('src', 'logo.png')
	})

	it('renders an AnimatedIcon with the first letter of the website domain if logo is not provided', () => {
		const { getByText } = render(<Logo website="example.com" />)
		expect(getByText('E')).toBeInTheDocument()
	})
})
