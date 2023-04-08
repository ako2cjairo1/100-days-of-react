import { Menubar } from '@/components'
import { fireEvent, render } from '@/services/Utils/test.util'
import { MemoryRouter } from 'react-router-dom'

describe('Item', () => {
	it('renders a Link with the given name as title', () => {
		const { getByTitle } = render(
			<MemoryRouter>
				<Menubar.Item name="Test" />
			</MemoryRouter>
		)
		expect(getByTitle('Test')).toBeInTheDocument()
	})

	it('navigates to the given URL when clicked', () => {
		const navigateTo = '/test'
		const { getByTitle } = render(
			<MemoryRouter>
				<Menubar.Item
					name="Test"
					navigateTo={navigateTo}
				/>
			</MemoryRouter>
		)
		fireEvent.click(getByTitle('Test'))
		// expect the URL to have changed to the given navigateTo value
	})

	it('calls the given callback function when clicked', () => {
		const menuCb = vi.fn()
		const { getByTitle } = render(
			<MemoryRouter>
				<Menubar.Item
					name="Test"
					onClick={menuCb}
				/>
			</MemoryRouter>
		)
		fireEvent.click(getByTitle('Test'))
		expect(menuCb).toHaveBeenCalled()
	})

	it('renders an icon with the given iconName', () => {
		const iconName = 'fa fa-test'
		const { getByTestId } = render(
			<MemoryRouter>
				<Menubar.Item
					name="Test"
					iconName={iconName}
				/>
			</MemoryRouter>
		)
		expect(getByTestId(iconName)).toBeInTheDocument()
	})
})
