import { useContext } from 'react'
import { render, fireEvent } from '@/services/Utils/test.util'
import { AuthContext, AuthProvider } from '@/services/context'
import type { TAuthProvider } from '@/types'

describe('AuthContext', () => {
	const initAuthState: TAuthProvider = {
		email: '',
		vault: '',
		vaultKey: '',
		accessToken: '',
		isLoggedIn: false,
	}

	it('provides initial auth state to its children', () => {
		let result = {}
		const TestSubscriberComponent = () => {
			const { authInfo: auth } = useContext(AuthContext)!
			result = auth // capture auth from context to test with
			return <pre>{JSON.stringify(auth)}</pre>
		}

		// render the AuthProvider as parent of our mock component
		render(
			<AuthProvider>
				<TestSubscriberComponent />
			</AuthProvider>
		)
		expect(result).toEqual(initAuthState)
	})

	it('allows updating the auth state using setAuth', async () => {
		let resultState = {}
		const mockSetAuth = vi.fn() // mock the setAuth action from context provider
		const authState = { email: 'test@example.com', vaultId: '1', accessToken: 'token' }

		const TestUpdateComponent = () => {
			const { authInfo: auth } = useContext(AuthContext)!
			resultState = auth // capture auth from context to test with

			const handleClick = () => mockSetAuth(authState)
			return <button onClick={handleClick}>Mock setAuth</button>
		}

		// render the AuthProvider as parent of our mock component
		const { getByText } = render(
			<AuthProvider>
				<TestUpdateComponent />
			</AuthProvider>
		)

		// we expect an initial value before the mockSetAuth action
		expect(resultState).toEqual(initAuthState)

		await fireEvent.click(getByText('Mock setAuth'))
		expect(mockSetAuth).toHaveBeenCalledWith(authState)
	})
})
