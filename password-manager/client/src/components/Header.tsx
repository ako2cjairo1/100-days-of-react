import { ReactNode } from 'react'

type HeaderProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement> & {
	children?: ReactNode
	title?: string
	subTitle?: string
	errMsg?: string
}

export const Header = ({ children, title, subTitle, errMsg, ...props }: HeaderProps) => {
	return (
		<header {...props}>
			{title && <h1>{title}</h1>}
			<p className="center">{subTitle}</p>
			{errMsg && (
				<p className="center error">
					<i className="fa fa-exclamation-triangle" />
					{errMsg}
				</p>
			)}
			{children}
		</header>
	)
}
