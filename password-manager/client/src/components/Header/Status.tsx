import { AnimatedIcon } from '../AnimatedIcon'
import { IChildren, TStatus } from '@/types'

interface IStatus extends IChildren {
	status?: TStatus
}
/**
 * parameter `children?: ReactNode`: Optional children to be rendered inside the header element.
 * parameter `status?: TStatus`: Optional status object with properties `success` and `errMsg`.
 *			If `status.success` is true, an icon with class "fa fa-check" will be rendered.
 * 			If `status.success` is false and `status.errMsg` is defined, an icon with class "fa fa-exclamation-triangle"
 * 			and a p element containing the error message will be rendered.
 */

export function Status({ children, status }: IStatus) {
	const isSuccessfulWithMessage = Object.values(status ? status : {}).every(Boolean)

	return (
		<>
			{status && (
				<div
					className={`center fdc ${status.message ? 'fade-in' : ''}`}
					style={{ opacity: `${status.message ? 1 : 0}` }}
				>
					{isSuccessfulWithMessage ? (
						<>
							<AnimatedIcon
								className="scale-up"
								iconName="fa fa-check-circle"
							/>
							<p className="center x-small descend">{status.message}</p>
						</>
					) : (
						status.message && (
							<>
								{!status.success && (
									<AnimatedIcon
										className="regular lit-error"
										iconName="fa-solid fa-triangle-exclamation"
										animation="fa-beat-fade"
										animateOnLoad
									/>
								)}
								<p className="center x-small descend error">{status.message}</p>
							</>
						)
					)}
				</div>
			)}
			{children}
		</>
	)
}
