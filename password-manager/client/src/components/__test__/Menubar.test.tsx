import { Menubar } from '@/components'
import { fireEvent, render } from '@/utils/test.util'
import { MemoryRouter } from 'react-router-dom'

describe('Item', () => {
	it('renders a Link with the given name as title', () => {
		const { getByTestId } = render(
			<MemoryRouter>
				<Menubar.Item name="Test" />
			</MemoryRouter>
		)
		expect(getByTestId('menubar-item')).toBeInTheDocument()
	})

	it('navigates to the given URL when clicked', () => {
		const navigateTo = '/test'
		const { getByTestId } = render(
			<MemoryRouter>
				<Menubar.Item
					name="Test"
					navigateTo={navigateTo}
				/>
			</MemoryRouter>
		)
		fireEvent.click(getByTestId('menubar-item'))
		// expect the URL to have changed to the given navigateTo value
	})

	it('calls the given callback function when clicked', () => {
		const menuCb = vi.fn()
		const { getByTestId } = render(
			<MemoryRouter>
				<Menubar.Item
					name="Test"
					onClick={menuCb}
				/>
			</MemoryRouter>
		)
		fireEvent.click(getByTestId('menubar-item'))
		expect(menuCb).toHaveBeenCalled()
	})

	it('renders an icon with the given iconName', () => {
		const iconName = 'animated-icon'
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
