import { VaultContainer } from '@/components'
import { render } from '@/services/Utils/test.util'
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
				<VaultContainer
					vault={keychains}
					actionCallback={listEvent}
				/>
			</MemoryRouter>
		)
		expect(container.querySelectorAll('.keychain-item')).toHaveLength(2)
	})
})
