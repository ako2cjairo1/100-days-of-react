import { SearchBar } from '@/components'
import { fireEvent, render } from '@/services/Utils/test.util'

describe('SearchBar', () => {
	it('calls searchCallback when search input changes', () => {
		const searchCallback = vi.fn(() => 1)
		const { getByPlaceholderText } = render(<SearchBar searchCb={searchCallback} />)

		fireEvent.change(getByPlaceholderText('Search keychains'), {
			target: { value: 'test' },
		})

		expect(searchCallback).toHaveBeenCalledWith('test')
	})

	it('displays message when search input changes', () => {
		const searchCallback = vi.fn(() => 3)
		const { getByPlaceholderText, getByText } = render(<SearchBar searchCb={searchCallback} />)

		fireEvent.change(getByPlaceholderText('Search keychains'), {
			target: { value: 'test' },
		})

		expect(getByText('3 keychain found')).toBeInTheDocument()
	})

	it('displays no results message when no results are found', () => {
		const searchCallback = vi.fn(() => 0)
		const { getByPlaceholderText, getByText } = render(<SearchBar searchCb={searchCallback} />)

		fireEvent.change(getByPlaceholderText('Search keychains'), {
			target: { value: 'test' },
		})

		expect(getByText(`No results for "test"`)).toBeInTheDocument()
	})

	it('displays suggestion to check spelling when no results are found', () => {
		const searchCallback = vi.fn(() => 0)
		const { getByPlaceholderText, getByText } = render(<SearchBar searchCb={searchCallback} />)

		fireEvent.change(getByPlaceholderText('Search keychains'), {
			target: { value: 'test' },
		})

		expect(getByText('Check the spelling or try a new search.')).toBeInTheDocument()
	})

	it('clears search input when clear button is clicked', () => {
		const searchCallback = vi.fn(() => 3)
		const { getByPlaceholderText, getByTestId } = render(<SearchBar searchCb={searchCallback} />)

		fireEvent.change(getByPlaceholderText('Search keychains'), {
			target: { value: 'test' },
		})

		fireEvent.click(getByTestId('close-button'))

		expect(getByPlaceholderText('Search keychains')).toHaveValue('')
	})
})
