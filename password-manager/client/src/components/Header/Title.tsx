import { IChildren } from '@/types'

interface ITitle extends IChildren {
	title?: string
	subTitle?: string
}

/**
 * parameter `children?: ReactNode`: Optional children to be rendered inside the Title div element.
 * parameter `title?: string`: Optional title to be rendered as an h1 element inside the header element.
 * parameter `subTitle?: string`: Optional subtitle to be rendered as a p element inside the header element.
 */
export function Title({ children, title, subTitle }: ITitle) {
	return (
		<div>
			{title && <h1 className="fade-in">{title}</h1>}
			{subTitle && <p className="center small descend">{subTitle}</p>}
			{children}
		</div>
	)
}
