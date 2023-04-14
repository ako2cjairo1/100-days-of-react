import { KeychainCard } from '@/components'
import { fireEvent, render } from '@/services/Utils/test.util'
import { MemoryRouter } from 'react-router-dom'

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
