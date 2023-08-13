import { RotatingBackdrop } from '@/components'
import { render } from '@/utils/test.util'

describe('RotatingBackdrop', () => {
	it('should render two shape elements', () => {
		const { getAllByTestId } = render(<RotatingBackdrop />)
		expect(getAllByTestId('shape')).toHaveLength(2)
	})
})
