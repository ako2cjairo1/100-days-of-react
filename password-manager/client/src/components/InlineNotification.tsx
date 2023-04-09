import { IChildren } from '@/types'
import { AnimatedIcon } from './AnimatedIcon'

interface IInlineNotification extends IChildren {
	iconName?: string
}
export function InlineNotification({ children, iconName }: IInlineNotification) {
	return (
		<div className="clipboard-status">
			<AnimatedIcon
				iconName={`${iconName ? iconName : 'fa fa-info-circle'}`}
				animation="fa-beat-fade"
				animateOnLoad
			/>
			<p className="center x-small descend">{children}</p>
		</div>
	)
}
