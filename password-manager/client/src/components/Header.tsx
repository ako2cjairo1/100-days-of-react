import { FCProps, IHeaderProps } from '@/types'

/** 
The `Header` component is a React functional component that renders a header element with optional title, subtitle, and status.

* @parameter `children?: ReactNode`: Optional children to be rendered inside the header element.
* @parameter `title?: string`: Optional title to be rendered as an h1 element inside the header element.
* @parameter `subTitle?: string`: Optional subtitle to be rendered as a p element inside the header element.
* @parameter `status?: TStatus`: Optional status object with properties `success` and `errMsg`. 
*			If `status.success` is true, an icon with class "fa fa-check" will be rendered. 
* 			If `status.success` is false and `status.errMsg` is defined, an icon with class "fa fa-exclamation-triangle" 
* 			and a p element containing the error message will be rendered.
*/

export const Header: FCProps<IHeaderProps> = ({ children, title, subTitle, status, ...rest }) => {
	return (
		<header {...rest}>
			{title && <h1>{title}</h1>}
			{subTitle && <p className="center">{subTitle}</p>}

			{status &&
				(status.success ? (
					<i className="fa fa-check" />
				) : (
					status.errMsg && (
						<div
							className={`center fdc ${status.errMsg ? 'fadein' : ''}`}
							style={{ opacity: `${status.errMsg ? 1 : 0}` }}
						>
							<i className="fa fa-exclamation-triangle pulse error" />
							<p className="center xsmall smooth fadein error">{status.errMsg}</p>
						</div>
					)
				))}
			{children}
		</header>
	)
}
