import { KeychainCardContainer } from '@/components/KeychainCard'
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
				<KeychainCardContainer
					vault={keychains}
					actionHandler={listEvent}
				/>
			</MemoryRouter>
		)
		expect(container.querySelectorAll('.keychain-item')).toHaveLength(2)
	})

	it('renders correctly', () => {
		const keychains = [
			{ keychainId: '1', logo: 'logo1', website: 'link1', username: 'username1' },
			{ keychainId: '2', logo: 'logo2', website: 'link2', username: 'username2' },
		]
		const listEvent = vi.fn()
		const { container } = render(
			<MemoryRouter>
				<KeychainCardContainer
					vault={keychains}
					actionHandler={listEvent}
				/>
			</MemoryRouter>
		)
		expect(container).toMatchInlineSnapshot(`
			<div>
			  <div
			    class="vault-list"
			  >
			    <div
			      class="keychain-item"
			    >
			      <a
			        href="http://link1"
			        rel="noreferrer"
			        style="text-decoration: none;"
			        target="_blank"
			      >
			        <img
			          alt="L"
			          class="header"
			          src="logo1"
			        />
			      </a>
			      <div
			        class="keychain-card-details"
			      >
			        <a
			          href="http://link1"
			          rel="noreferrer"
			          target="_blank"
			        >
			          link1
			        </a>
			        <p
			          class="small"
			        >
			          username1
			        </p>
			      </div>
			      <a
			        class="menu descend"
			        data-testid="keychain-card-link"
			        href="/vault"
			      >
			        <i
			          class="x-small fa fa-chevron-right "
			          data-testid="animated-icon"
			          title=""
			        />
			      </a>
			    </div>
			    <div
			      class="keychain-item"
			    >
			      <a
			        href="http://link2"
			        rel="noreferrer"
			        style="text-decoration: none;"
			        target="_blank"
			      >
			        <img
			          alt="L"
			          class="header"
			          src="logo2"
			        />
			      </a>
			      <div
			        class="keychain-card-details"
			      >
			        <a
			          href="http://link2"
			          rel="noreferrer"
			          target="_blank"
			        >
			          link2
			        </a>
			        <p
			          class="small"
			        >
			          username2
			        </p>
			      </div>
			      <a
			        class="menu descend"
			        data-testid="keychain-card-link"
			        href="/vault"
			      >
			        <i
			          class="x-small fa fa-chevron-right "
			          data-testid="animated-icon"
			          title=""
			        />
			      </a>
			    </div>
			  </div>
			</div>
		`)
	})
})

// import { Header } from '@/components'
// import { render, cleanup } from '@/services/Utils/test-utils'
// afterEach(() => cleanup())
// 1. Generate function comments (/** * short description here... * param ... * param ... * returns ... */)
// 2. Generate robust automated test cases (react-testing i.e.: describe, it, expected to be, etc.). Create all possible test cases depending of the component props or function arguments.
