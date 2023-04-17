import { CloseIcon } from '@/components/Modal'
import { render, fireEvent } from '@/services/Utils/test.util'

describe('CloseIcon', () => {
	it('applies className to component', () => {
		const { container } = render(<CloseIcon className="test-class" />)

		expect(container.firstChild).toHaveClass('test-class')
	})

	it('displays default icon when iconName is not provided', () => {
		const { container } = render(<CloseIcon />)

		expect(container.querySelector('.fa-close')).toBeInTheDocument()
	})

	it('displays custom icon when iconName is provided', () => {
		const { container } = render(<CloseIcon iconName="fa fa-test" />)

		expect(container.querySelector('.fa-test')).toBeInTheDocument()
	})

	it('calls onClick when clicked', () => {
		const onClick = vi.fn()
		const { getByTestId } = render(<CloseIcon onClick={onClick} />)

		fireEvent.click(getByTestId('close-button'))

		expect(onClick).toHaveBeenCalled()
	})
})
