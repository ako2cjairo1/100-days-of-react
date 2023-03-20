import { FCProps, IRequiredLabelProps } from '@/types'

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

export const RequiredLabel: FCProps<IRequiredLabelProps> = ({
	children,
	labelFor,
	label,
	subLabel,
	isFulfilled = false,
	isOptional = false,
	...rest
}) => {
	return (
		<label
			{...rest}
			htmlFor={labelFor}
		>
			{`${label} `}
			{!isOptional ? (
				<i className={`${isFulfilled ? 'fa fa-check scaleup' : 'xsmall'}`}>
					{subLabel}
					{!isFulfilled && ' (required)'}
				</i>
			) : (
				subLabel
			)}
			{children ? children : null}
		</label>
	)
}
