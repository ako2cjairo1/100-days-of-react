import { IChildren } from '@/types'
import { AnimatedIcon } from './AnimatedIcon'

/**
 * This function returns a div element containing an animated icon and a paragraph element displaying the children prop.
 * param {IInlineNotification} { children, iconName } - The props for the InlineNotification component.
 * param {string} [iconName] - The name of the icon to be displayed. Defaults to 'fa fa-info-circle'.
 * returns {JSX.Element} - A div element containing an animated icon and a paragraph element displaying the children prop.
 */
interface IInlineNotification extends IChildren {
	iconName?: string
	className?: string
}
export function InlineNotification({ children, iconName, className }: IInlineNotification) {
	return (
		<div className="clipboard-status">
			<p className="center small descend">
				<AnimatedIcon
					className={className}
					iconName={`${iconName ? iconName : 'fa fa-info-circle'}`}
					animation="fa-beat-fade"
					animateOnLoad
				/>
				{children}
			</p>
		</div>
	)
}
