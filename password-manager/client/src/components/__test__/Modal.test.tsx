import { Modal } from '@/components'
import { fireEvent, render } from '@/services/Utils/test.util'

beforeAll(() => {
	const modalRoot = document.createElement('div')
	modalRoot.setAttribute('id', 'modal-root')
	document.body.appendChild(modalRoot)
})

afterAll(() => {
	const modalRoot = document.getElementById('modal-root')
	if (modalRoot) {
		document.body.removeChild(modalRoot)
	}
})
describe('Modal component', () => {
	it('renders the modal content when isOpen is true', () => {
		const { getByText } = render(
			<Modal props={{ isOpen: true, onClose: () => {} }}>
				<div>Modal content</div>
			</Modal>
		)
		expect(getByText('Modal content')).toBeInTheDocument()
	})

	it('does not render the modal content when isOpen is false', () => {
		const { queryByText } = render(
			<Modal props={{ isOpen: false, onClose: () => {} }}>
				<div>Modal content</div>
			</Modal>
		)
		expect(queryByText('Modal content')).not.toBeInTheDocument()
	})

	it('calls the onClose callback when the close button is clicked', () => {
		const onClose = vi.fn()
		const { getByTestId } = render(
			<Modal props={{ isOpen: true, onClose }}>
				<div>Modal content</div>
			</Modal>
		)
		fireEvent.click(getByTestId('modal-close'))
		expect(onClose).toHaveBeenCalled()
	})
})
