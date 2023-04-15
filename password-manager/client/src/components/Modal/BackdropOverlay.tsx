import { IChildren, TFunction } from '@/types'

interface IBackdropOverlay extends IChildren {
	className?: string
	onClick?: TFunction
}
export function BackdropOverlay({ children, className, onClick = () => null }: IBackdropOverlay) {
	return (
		<div
			data-testid="modal-overlay"
			className={`modal-overlay ${className}`}
			onClick={() => onClick()}
		>
			{children}
		</div>
	)
}
