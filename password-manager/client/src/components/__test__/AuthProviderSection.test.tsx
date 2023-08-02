import { AuthProviderSection } from '@/components'
import { render, fireEvent } from '@/services/Utils/test.util'

describe('AuthProviderSection', () => {
	const callbackFn = vi.fn()
	it('renders a div with class social and has 3 buttons inside it', async () => {
		const { getByTestId } = render(<AuthProviderSection callbackFn={callbackFn} />)
		const socialDiv = getByTestId('social')

		if (socialDiv) {
			expect(socialDiv).toBeInTheDocument()
			const buttonElements = socialDiv.querySelectorAll('button')
			expect(buttonElements).toHaveLength(3)

			expect(buttonElements[0]!.textContent).toBe(' Meta')
			expect(buttonElements[1]!.textContent).toBe(' Google')
			expect(buttonElements[2]!.textContent).toBe(' Github')
		} else {
			assert.fail(`div with class 'social' did't found.`)
		}
	})

	it('renders three buttons', () => {
		const { getAllByRole } = render(<AuthProviderSection callbackFn={callbackFn} />)
		const buttons = getAllByRole('button')
		expect(buttons).toHaveLength(3)
	})

	it('calls handleExternalAuth when a button is clicked', () => {
		const callbackFn = vi.fn()
		const { getAllByRole } = render(<AuthProviderSection callbackFn={callbackFn} />)
		const buttons = getAllByRole('button')

		fireEvent.click(buttons[0]!)
		expect(callbackFn).toHaveBeenCalled()
	})
})
