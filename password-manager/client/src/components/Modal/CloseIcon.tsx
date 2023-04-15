import { AnimatedIcon, IAnimatedIcon } from '@/components/AnimatedIcon'

export function CloseIcon({
	className = '',
	iconName = '',
	onClick = () => null,
}: Pick<IAnimatedIcon, 'className' | 'iconName' | 'onClick'>) {
	return (
		<a
			data-testid="modal-close"
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
