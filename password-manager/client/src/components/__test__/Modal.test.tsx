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
	it('renders its children when isOpen is true', () => {
		const { getByText } = render(
			<Modal isOpen={true}>
				<div>Modal Content</div>
			</Modal>
		)
		expect(getByText('Modal Content')).toBeInTheDocument()
	})

	it('does not render anything when isOpen is false', () => {
		const { container } = render(
			<Modal isOpen={false}>
				<div>Modal Content</div>
			</Modal>
		)
		expect(container).toBeEmptyDOMElement()
	})

	it('calls the onClose callback when the close button is clicked', () => {
		const onClose = vi.fn()
		const { getByTestId } = render(
			<Modal
				isOpen={true}
				onClose={onClose}
			>
				<div>Modal content</div>
			</Modal>
		)
		fireEvent.click(getByTestId('close-button'))
		expect(onClose).toHaveBeenCalled()
	})

	it('calls onClose when the backdrop is clicked and clickBackdropToClose is true', () => {
		const onClose = vi.fn()
		const { getByTestId } = render(
			<Modal
				isOpen={true}
				onClose={onClose}
				clickBackdropToClose={true}
			>
				<div>Modal Content</div>
			</Modal>
		)
		fireEvent.click(getByTestId('modal-overlay'))
		expect(onClose).toHaveBeenCalled()
	})

	it('does not call onClose when the backdrop is clicked and clickBackdropToClose is false', () => {
		const onClose = vi.fn()
		const { getByTestId } = render(
			<Modal
				isOpen={true}
				onClose={onClose}
				clickBackdropToClose={false}
			>
				<div>Modal Content</div>
			</Modal>
		)
		fireEvent.click(getByTestId('modal-overlay'))
		expect(onClose).not.toHaveBeenCalled()
	})
})
