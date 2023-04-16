import { IChildren } from '@/types'
import { AnimatedIcon } from '../AnimatedIcon'

/**
 * Renders a Logo component
 * param children - The children elements to be rendered inside the Logo
 *
 * returns A React element representing a Logo component
 */
export function Logo({ children }: IChildren) {
	return (
		<h1 className="scale-up">
			{children ? (
				children
			) : (
				<>
					<AnimatedIcon
						className="logo-key fade-in"
						iconName="fa fa-key"
					/>
					<AnimatedIcon
						className="logo-shield scale-up"
						iconName="fa fa-shield"
					/>
				</>
			)}
		</h1>
	)
}
