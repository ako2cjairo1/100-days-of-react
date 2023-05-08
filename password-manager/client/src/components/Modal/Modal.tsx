import { createPortal } from 'react-dom'
import '@/assets/modules/Modal.css'
import { CloseIcon, BackdropOverlay } from '@/components/Modal'
import type { IChildren, TFunction } from '@/types'
import { useState } from 'react'

export interface IModal extends IChildren {
	isOpen?: boolean
	noBackdrop?: boolean
	hideCloseIcon?: boolean
	clickBackdropToClose?: boolean
	onClose?: TFunction
}
/**
 * This is a Modal component that displays its children when isOpen is true.
 * param children - The content to be displayed inside the modal.
 * param props - An object containing the following properties:
 * param props.isOpen - A boolean indicating whether the modal is open or not.
 * param props.onClose - A function to be called when the modal is closed.
 * param props.noBackdrop - An optional boolean indicating whether to show the backdrop or not. Defaults to false.
 * param props.hideCloseIcon - An optional boolean indicating whether to hide the close button or not. Defaults to false.
 * param props.clickBackdropToClose - An optional boolean indicating whether clicking on the backdrop should close the modal. Defaults to true.
 *
 * returns A React Portal containing the modal if isOpen is true, otherwise null.
 */
export function Modal({
	children,
	isOpen = true,
	onClose,
	noBackdrop = false,
	hideCloseIcon,
	clickBackdropToClose = true,
}: IModal) {
	const [close, setClose] = useState(false)
	if (!isOpen || close) {
		return null
	}

	const handleClose = () => {
		if (onClose) return onClose()
		setClose(true)
	}

	const modalRoot = document.getElementById('modal-root')
	if (!modalRoot) return null

	return createPortal(
		<div className="modal-wrapper">
			{!noBackdrop && <BackdropOverlay onClick={clickBackdropToClose ? handleClose : () => null} />}
			<div className="modal-container form-container descend">
				{!hideCloseIcon && <CloseIcon onClick={handleClose} />}
				{children}
			</div>
		</div>,
		modalRoot
	)
}
