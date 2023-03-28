import { FCProps, ILinkLabel } from '@/types'
import { Link } from 'react-router-dom'

/**
 * This is a LinkLabel component that displays a link with preText.
 *
 * param {Ref<HTMLAnchorElement>} linkRef - A ref to handle focus from parent component
 * param {string} routeTo - The route to navigate to when the link is clicked
 * param {string} preText - The text to display before the link
 *
 * returns {JSX.Element} A Custom LinkLabel component
 */

export const LinkLabel: FCProps<ILinkLabel> = ({
	children,
	linkRef,
	routeTo,
	preText,
	className,
	onClick,
}) => {
	return (
		<div className={`${className} center small descend`}>
			<p className="small">
				{preText}{' '}
				<Link
					ref={linkRef} // to handle focus from parent component
					to={routeTo}
					onClick={onClick}
				>
					{children}
				</Link>
			</p>
		</div>
	)
}
