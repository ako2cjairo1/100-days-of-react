import { ReactNode } from 'react'

type RequiredLabelProps = React.DetailedHTMLProps<
	React.LabelHTMLAttributes<HTMLLabelElement>,
	HTMLLabelElement
> & {
	children?: ReactNode
	labelFor: string
	label: string
	subLabel?: string
	isFulfilled?: boolean
}
export const RequiredLabel = ({
	children,
	labelFor,
	label,
	subLabel,
	isFulfilled = false,
	...rest
}: RequiredLabelProps) => {
	return (
		<label
			{...rest}
			htmlFor={labelFor}
		>
			{`${label} `}
			{
				<i className={`${isFulfilled ? 'fa fa-check scaleup' : 'xsmall'}`}>
					{subLabel}
					{!isFulfilled && ' (required)'}
				</i>
			}
			{children ? children : null}
		</label>
	)
}
