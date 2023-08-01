import type { IChildren } from '@/types'
/**
 * Renders a separator with an optional `children` prop.
 *
 * param children - The content to render between the separator lines. Optional.
 * returns A `div` element with the class `separator small` containing two `div` elements with the class `line`,
 * separated by the content of the `children` prop (if provided).
 */
export function Separator({ children }: IChildren) {
	return (
		<div className="separator">
			<span></span>
			{children ? children : <i className="fa fa-hyphen" />}
			<span></span>
		</div>
	)
}
