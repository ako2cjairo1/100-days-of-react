import { AuthProviderSection } from '@/components'
import { render, fireEvent } from '@/services/Utils/test.util'

describe('AuthProviderSection', () => {
	it('renders a div with class social and has 3 buttons inside it', async () => {
		const { getByTestId } = render(<AuthProviderSection />)
		const socialDiv = getByTestId('social')

		if (socialDiv) {
			expect(socialDiv).toBeInTheDocument()
			const buttonElements = socialDiv.querySelectorAll('button')
			expect(buttonElements).toHaveLength(3)

			expect(buttonElements[0]!.textContent).toBe(' Apple')
			// expect(buttonElements[0].querySelector('.fab.fa-apple')).toBeInTheDocument()
			expect(buttonElements[1]!.textContent).toBe(' Google')
			// expect(buttonElements[1].querySelector('.fab.fa-google')).toBeInTheDocument()
			expect(buttonElements[2]!.textContent).toBe(' Github')
			// expect(buttonElements[2].querySelector('.fab.fa-github')).toBeInTheDocument()
		} else {
			assert.fail(`div with class 'social' did't found.`)
		}
	})

	it('renders three buttons', () => {
		const { getAllByRole } = render(<AuthProviderSection />)
		const buttons = getAllByRole('button')
		expect(buttons).toHaveLength(3)
	})

	it('calls handleExternalAuth when a button is clicked', () => {
		window.alert = vi.fn()
		const { getAllByRole } = render(<AuthProviderSection />)
		const buttons = getAllByRole('button')

		fireEvent.click(buttons[0]!)
		expect(window.alert).toHaveBeenCalled()
	})
})