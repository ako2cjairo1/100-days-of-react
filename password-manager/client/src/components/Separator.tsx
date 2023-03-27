import { FCWithChildren } from '@/types'

/**
 * Renders a separator with an optional `children` prop.
 *
 * @param children - The content to render between the separator lines. Optional.
 *
 * @returns A `div` element with the class `separator small` containing two `div` elements with the class `line`,
 * separated by the content of the `children` prop (if provided).
 */
export const Separator: FCWithChildren = ({ children }) => {
	return (
		<div className="separator small">
			<div className="line"></div>
			{children}
			{children ? <div className="line"></div> : null}
		</div>
	)
}
