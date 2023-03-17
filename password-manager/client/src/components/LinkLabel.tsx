import { ReactNode, Ref } from 'react'
import { Link } from 'react-router-dom'

type LinkLabelProps = {
	children?: ReactNode
	linkRef?: Ref<HTMLAnchorElement>
	routeTo: string
	text: string
}

export const LinkLabel = ({ children, linkRef, routeTo, text }: LinkLabelProps) => {
	return (
		<p className="small">
			{text}{' '}
			<Link
				ref={linkRef}
				to={routeTo}
			>
				{children}
			</Link>
		</p>
	)
}
