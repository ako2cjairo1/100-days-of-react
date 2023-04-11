import { useDebounceToggle } from '@/hooks'
import { IChildren, IHeaderProps } from '@/types'
import { AnimatedIcon } from './AnimatedIcon'

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

function Logo({ children }: IChildren) {
	return (
		<h1 className="scale-up">
			<AnimatedIcon
				className="logo-key fade-in"
				iconName="fa fa-key"
			/>
			<AnimatedIcon
				className="logo-shield scale-up"
				iconName="fa fa-shield"
			/>
			{children}
		</h1>
	)
}

function Title({
	children,
	title,
	subTitle,
}: Pick<IHeaderProps, 'children' | 'title' | 'subTitle'>) {
	return (
		<div style={{ marginTop: '15px' }}>
			{title && <h1 className="fade-in">{title}</h1>}
			{subTitle && <p className="center descend">{subTitle}</p>}
			{children}
		</div>
	)
}

function Status({ children, status }: Pick<IHeaderProps, 'children' | 'status'>) {
	const isSuccessfulWithMessage = Object.values(status ? status : {}).every(Boolean)
	const delaySuccess = useDebounceToggle(isSuccessfulWithMessage)

	return (
		<>
			{status && (
				<div
					className={`center fdc ${status.message ? 'fade-in' : ''}`}
					style={{ opacity: `${status.message ? 1 : 0}` }}
				>
					{isSuccessfulWithMessage
						? delaySuccess && (
								<>
									<AnimatedIcon
										className="scale-up"
										iconName="fa fa-check-circle"
									/>
									<p className="center x-small descend">{status.message}</p>
								</>
						  )
						: delaySuccess &&
						  status.message && (
								<>
									{!status.success && (
										<AnimatedIcon
											className="regular error"
											iconName="fa-solid fa-triangle-exclamation"
											animation="fa-beat-fade"
											animateOnLoad
										/>
									)}
									<p className="center x-small descend error">{status.message}</p>
								</>
						  )}
				</div>
			)}
			{children}
		</>
	)
}

export function Header({ children, ...props }: IHeaderProps) {
	return <header {...props}>{children}</header>
}

Header.Logo = Logo
Header.Title = Title
Header.Status = Status
