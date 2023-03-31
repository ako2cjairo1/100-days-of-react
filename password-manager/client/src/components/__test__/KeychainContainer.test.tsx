import { KeychainContainer, KeychainItem } from '@/components'
import { fireEvent, render } from '@/services/Utils/test.util'

describe('Keychain components', () => {
	it('renders a list of KeychainItem components', () => {
		const securedList = [
			{ logo: 'logo1', link: 'link1', username: 'username1' },
			{ logo: 'logo2', link: 'link2', username: 'username2' },
		]
		const listEvent = vi.fn()
		const { container } = render(
			<KeychainContainer>
				<KeychainContainer.List
					securedList={securedList}
					listEvent={listEvent}
				/>
			</KeychainContainer>
		)
		expect(container.querySelectorAll('.keychain-item')).toHaveLength(2)
	})

	it('triggers the listEvent callback when a KeychainItem is clicked', () => {
		const securedList = [
			{ logo: 'logo1', link: 'link1', username: 'username1' },
			{ logo: 'logo2', link: 'link2', username: 'username2' },
		]
		const listEvent = vi.fn()
		const { container } = render(
			<KeychainContainer>
				<KeychainContainer.List
					securedList={securedList}
					listEvent={listEvent}
				/>
			</KeychainContainer>
		)

		const keychainItems = container.querySelectorAll('.keychain-item')
		if (keychainItems[0]) {
			fireEvent.click(keychainItems[0])
		}
		expect(listEvent).toHaveBeenCalled()
	})
})
