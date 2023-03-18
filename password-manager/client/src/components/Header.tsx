import { TStatus } from '@/types/PasswordManager.type'
import { ReactNode } from 'react'

type HeaderProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
	children?: ReactNode
	title?: string
	subTitle?: string
	status?: TStatus
}

export const Header = ({ children, title, subTitle, status, ...props }: HeaderProps) => {
	return (
		<header {...props}>
			{title && <h1>{title}</h1>}
			{subTitle && <p className="center">{subTitle}</p>}

			{status ? (
				status.success ? (
					<i className="fa fa-check" />
				) : (
					status.errMsg && (
						<div className="center fdc">
							<i className="fa fa-exclamation-triangle smooth scaleup error" />
							<p className="center smooth fadein">{status && status.errMsg}</p>
						</div>
					)
				)
			) : (
				children
			)}
		</header>
	)
}
