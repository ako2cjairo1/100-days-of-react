import { Toolbar } from '@/components'
import { fireEvent, render } from '@/services/Utils/test.util'

describe('Toolbar', () => {
	it('calls menuCb when Toolbar.Item is clicked', () => {
		const menuCb = vi.fn()
		const { getByTitle } = render(
			<Toolbar.Item
				name="Item 1"
				menuCb={menuCb}
			/>
		)
		fireEvent.click(getByTitle('Item 1'))
		expect(menuCb).toHaveBeenCalled()
	})
})
