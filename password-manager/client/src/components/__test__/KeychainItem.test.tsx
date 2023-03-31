import { KeychainItem } from '@/components'
import { fireEvent, render } from '@/services/Utils/test.util'

describe('KeychainItem', () => {
	it('renders correctly', () => {
		const props = {
			logo: 'logo.png',
			link: 'https://example.com',
			username: 'testuser',
			onClick: vi.fn(),
		}
		const { getByText, getByAltText } = render(<KeychainItem {...props} />)
		expect(getByText(props.link)).toBeInTheDocument()
		expect(getByText(props.username)).toBeInTheDocument()
		expect(getByAltText(props.link)).toHaveAttribute('src', props.logo)
	})

	it('calls onClick when clicked', () => {
		const props = {
			logo: 'logo.png',
			link: 'https://example.com',
			username: 'testuser',
			onClick: vi.fn(),
		}
		const { getByText } = render(<KeychainItem {...props} />)
		fireEvent.click(getByText(props.username))
		expect(props.onClick).toHaveBeenCalledWith(props.username)
	})
})
