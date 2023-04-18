import type { IChildren } from '@/types'

interface IDescription extends IChildren {
	checked?: boolean
}
/**
 * A component that renders a span element with a description class and an optional description-active class.
 * param children - The content to be rendered inside the span element.
 * param checked - A boolean value that determines if the description-active class should be added to the span element.
 */
export function Description({ children, checked }: IDescription) {
	return (
		<span
			data-testid="toggle-description"
			className={`description ${checked ? 'description-active' : ''}`}
		>
			{children}
		</span>
	)
}
