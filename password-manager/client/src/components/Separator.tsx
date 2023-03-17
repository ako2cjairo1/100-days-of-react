import { ReactNode } from 'react'

type SeparatorProps = {
	children?: ReactNode
}

export const Separator = ({ children }: SeparatorProps) => {
	return (
		<div className="separator small">
			<div className="line"></div>
			{children}
			{children ? <div className="line"></div> : null}
		</div>
	)
}
