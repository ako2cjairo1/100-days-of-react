import '@/assets/modules/Modal.css'
import { FCProps, IModal } from '@/types'
import { createPortal } from 'react-dom'

export const Modal: FCProps<IModal> = ({
	children,
	props: { isOpen, onClose, noBackdrop = false, hideCloseButton, clickBackdropToClose = true },
}) => {
	if (!isOpen) {
		return null
	}

	const modalRoot = document.getElementById('modal-root') as HTMLElement

	if (!modalRoot) return null
	modalRoot.style.position = 'absolute'

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
						className="modal-close"
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
