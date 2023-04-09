import { useDelayToggle } from '@/hooks'
import { IRequiredLabelProps } from '@/types'
/**
 * This function returns a label element with the given properties.
 * @param {string} labelFor - The id of the form element that the label is bound to.
 * @param {string} label - The text content of the label.
 * @param {string} [subLabel] - (optional) The sub-label text content.
 * @param {boolean} [isFulfilled=false] - (optional) Whether or not the associated form element has been fulfilled.
 * @param {boolean} [isOptional=true] - (optional) Whether or not the associated form element is required.
 *
 * @returns {JSX.Element} A label element with the given properties.
 */

export function RequiredLabel({
	children,
	labelFor,
	label,
	subLabel,
	isFulfilled = false,
	isOptional = false,
	...rest
}: IRequiredLabelProps) {
	// use to delay animation of check icon (isFulfilled)
	const delayedToggle = useDelayToggle(isFulfilled)

	return (
		<label
			{...rest}
			htmlFor={labelFor}
		>
			{`${label} `}
			{!isOptional ? (
				<i className={`${isFulfilled ? `${delayedToggle && 'fa fa-check'} scale-up` : 'x-small'}`}>
					{subLabel}
					{!isFulfilled && ' (required)'}
				</i>
			) : subLabel ? (
				subLabel
			) : (
				'(optional)'
			)}
			{children ? children : null}
		</label>
	)
}
