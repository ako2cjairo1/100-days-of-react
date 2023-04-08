import '@/assets/modules/Modal.css'
import { IModal } from '@/types'
import { createPortal } from 'react-dom'

/**
 * This is a Modal component that displays its children when isOpen is true.
 * param children - The content to be displayed inside the modal.
 * param props - An object containing the following properties:
 * param props.isOpen - A boolean indicating whether the modal is open or not.
 * param props.onClose - A function to be called when the modal is closed.
 * param props.noBackdrop - An optional boolean indicating whether to show the backdrop or not. Defaults to false.
 * param props.hideCloseButton - An optional boolean indicating whether to hide the close button or not. Defaults to false.
 * param props.clickBackdropToClose - An optional boolean indicating whether clicking on the backdrop should close the modal. Defaults to true.
 *
 * returns A React Portal containing the modal if isOpen is true, otherwise null.
 */
export function Modal({
	children,
	isOpen,
	onClose,
	noBackdrop = false,
	hideCloseButton,
	clickBackdropToClose = true,
}: IModal) {
	if (!isOpen) {
		return null
	}

	const modalRoot = document.getElementById('modal-root')
	if (!modalRoot) return null

	return createPortal(
		<div className="modal-wrapper">
			{!noBackdrop && (
				<div
					className="modal-overlay"
					onClick={clickBackdropToClose ? onClose : () => null}
				/>
			)}
			<div className="modal-container form-container descend">
				{!hideCloseButton && (
					<div
						data-testid="modal-close"
						className="close-icon modal-close"
						onClick={onClose}
					>
						<i className="fa fa-close spins" />
					</div>
				)}

				{children}
			</div>
		</div>,
		modalRoot
	)
}
