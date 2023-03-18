import { ReactNode, Ref } from 'react'
import { Link } from 'react-router-dom'

type LinkLabelProps = Omit<
	React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>,
	'ref'
> & {
	children?: ReactNode
	linkRef?: Ref<HTMLAnchorElement>
	routeTo: string
	preText: string
}

export const LinkLabel = ({ children, linkRef, routeTo, preText, ...rest }: LinkLabelProps) => {
	return (
		<div className={rest.className ? rest.className : 'center small'}>
			<p className="small">{preText} </p>
			<Link
				ref={linkRef}
				to={routeTo}
				onClick={rest.onClick}
			>
				{children}
			</Link>
		</div>
	)
}
