import { AnimatedIcon, IAnimatedIcon } from '@/components/AnimatedIcon'

/**
 * CloseIcon component that displays an animated close icon.
 *
 * param {string} [props.className=''] - The className of the CloseIcon component.
 * param {string} [props.iconName=''] - The name of the icon to be displayed. Defaults to 'fa fa-close'.
 * param {() => void} [props.onClick=() => null] - The onClick function that is triggered when the CloseIcon component is clicked. Defaults to a no-op function.
 *
 * returns {JSX.Element} - The CloseIcon component.
 */

export function CloseIcon({
	className = '',
	iconName = '',
	onClick = () => null,
}: Pick<IAnimatedIcon, 'className' | 'iconName' | 'onClick'>) {
	return (
		<a
			data-testid="close-button"
			className={`modal-close ${className}`}
			onClick={onClick}
		>
			<AnimatedIcon
				className="spins"
				iconName={`${iconName ? iconName : 'fa fa-close'}`}
			/>
		</a>
	)
}
