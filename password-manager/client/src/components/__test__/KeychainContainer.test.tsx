import { KeychainContainer } from '@/components'
import { fireEvent, render } from '@/services/Utils/test.util'
import { MemoryRouter } from 'react-router-dom'

describe('Keychain components', () => {
	it('renders a list of KeychainItem components', () => {
		const keychain = [
			{ keychainId: '1', logo: 'logo1', website: 'link1', username: 'username1' },
			{ keychainId: '2', logo: 'logo2', website: 'link2', username: 'username2' },
		]
		const listEvent = vi.fn()
		const { container } = render(
			<MemoryRouter>
				<KeychainContainer>
					<KeychainContainer.Keychain {...{ keychain, event: listEvent }} />
				</KeychainContainer>
			</MemoryRouter>
		)
		expect(container.querySelectorAll('.keychain-item')).toHaveLength(2)
	})

	it('triggers the listEvent callback when a KeychainItem is clicked', () => {
		const keychain = [
			{ keychainId: '1', logo: 'logo1', website: 'link1', username: 'username1' },
			{ keychainId: '2', logo: 'logo2', website: 'link2', username: 'username2' },
		]
		const listEvent = vi.fn()
		const { container } = render(
			<MemoryRouter>
				<KeychainContainer>
					<KeychainContainer.Keychain {...{ keychain, event: listEvent }} />
				</KeychainContainer>
			</MemoryRouter>
		)

		const keychainItems = container.querySelectorAll('.keychain-item')
		if (keychainItems[0]) {
			fireEvent.click(keychainItems[0])
		}
		expect(listEvent).toHaveBeenCalled()
	})
})
