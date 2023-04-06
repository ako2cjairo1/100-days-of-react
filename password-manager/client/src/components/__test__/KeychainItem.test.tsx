import { KeychainItem } from '@/components'
import { fireEvent, render } from '@/services/Utils/test.util'
import { MemoryRouter } from 'react-router-dom'

describe('KeychainItem', () => {
	it('renders correctly', () => {
		const props = {
			keychainId: '1',
			logo: 'logo.png',
			website: 'https://example.com',
			username: 'testuser',
			onClick: vi.fn(),
		}
		const { getByText, getByAltText } = render(
			<MemoryRouter>
				<KeychainItem {...props} />
			</MemoryRouter>
		)
		expect(getByText(props.website)).toBeInTheDocument()
		expect(getByText(props.username)).toBeInTheDocument()
		expect(getByAltText(props.website)).toHaveAttribute('src', props.logo)
	})

	it('calls onClick when clicked', () => {
		const props = {
			keychainId: '1',
			logo: 'logo.png',
			website: 'https://example.com',
			username: 'testuser',
			onClick: vi.fn(),
		}
		const { getByText } = render(
			<MemoryRouter>
				<KeychainItem {...props} />
			</MemoryRouter>
		)
		fireEvent.click(getByText(props.username))
		expect(props.onClick).toHaveBeenCalled()
	})
})
