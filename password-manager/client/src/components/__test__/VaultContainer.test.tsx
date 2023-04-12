import { VaultContainer } from '@/components'
import { fireEvent, render } from '@/services/Utils/test.util'
import { MemoryRouter } from 'react-router-dom'

describe('Keychain components', () => {
	it('renders a list of KeychainItem components', () => {
		const keychains = [
			{ keychainId: '1', logo: 'logo1', website: 'link1', username: 'username1' },
			{ keychainId: '2', logo: 'logo2', website: 'link2', username: 'username2' },
		]
		const listEvent = vi.fn()
		const { container } = render(
			<MemoryRouter>
				<VaultContainer>
					<VaultContainer.Vault {...{ vault: keychains, onClick: listEvent }} />
				</VaultContainer>
			</MemoryRouter>
		)
		expect(container.querySelectorAll('.keychain-item')).toHaveLength(2)
	})

	it('triggers the listEvent callback when a KeychainItem is clicked', () => {
		const keychains = [
			{ keychainId: '1', logo: 'logo1', website: 'link1', username: 'username1' },
			{ keychainId: '2', logo: 'logo2', website: 'link2', username: 'username2' },
		]
		const listEvent = vi.fn()
		const { container, queryAllByRole } = render(
			<MemoryRouter>
				<VaultContainer>
					<VaultContainer.Vault {...{ vault: keychains, onClick: listEvent }} />
				</VaultContainer>
			</MemoryRouter>
		)

		const keychainItems = container.querySelectorAll('.keychain-item-header')
		const linkItem = queryAllByRole('link')

		if (keychainItems[0]) {
			fireEvent.click(keychainItems[0])
			expect(listEvent).toHaveBeenCalled()
		} else {
			expect(listEvent).toHaveBeenCalled()
		}

		if (linkItem[0]) {
			fireEvent.click(linkItem[0])
			expect(listEvent).toHaveBeenCalled()
		} else {
			expect(listEvent).toHaveBeenCalled()
		}
	})
})
