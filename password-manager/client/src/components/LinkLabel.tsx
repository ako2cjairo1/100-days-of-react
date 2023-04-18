import { Link } from 'react-router-dom'
import type { IChildren, TDetailedHTMLProps } from '@/types'

interface ILinkLabel extends IChildren, Pick<TDetailedHTMLProps, 'className' | 'onClick'> {
	linkRef?: React.Ref<HTMLAnchorElement>
	routeTo: string
	preText: string
}
/**
 * This is a LinkLabel component that displays a link with preText.
 *
 * param {Ref<HTMLAnchorElement>} linkRef - A ref to handle focus from parent component
 * param {string} routeTo - The route to navigate to when the link is clicked
 * param {string} preText - The text to display before the link
 *
 * returns {JSX.Element} A Custom LinkLabel component
 */

export function LinkLabel({ children, linkRef, routeTo, preText, className, onClick }: ILinkLabel) {
	return (
		<div className={`${className} center small descend`}>
			<p className="small enabled">
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
