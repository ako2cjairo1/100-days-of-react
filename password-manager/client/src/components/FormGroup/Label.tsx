import type { IChildren, IRequiredLabelProps } from '@/types'
import { RequiredLabel } from '@/components'

interface ILabel extends IChildren {
	props: Pick<IRequiredLabelProps, 'label' | 'labelFor' | 'subLabel' | 'isOptional' | 'isFulfilled'>
}
/**
 * Renders a label for a form input
 * param children - The child components to be rendered inside the label
 * param props - An object containing the label properties
 *
 * returns A div element with the class "password-label" containing a RequiredLabel component and the child components
 */
export function Label({ children, props }: ILabel) {
	return (
		<div className="password-label">
			<RequiredLabel {...props} />
			{children}
		</div>
	)
}
