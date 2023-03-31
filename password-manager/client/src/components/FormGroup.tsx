import { FCProps, IChildren, IInputElement, IRequiredLabelProps } from '@/types'
import { RequiredLabel } from './RequiredLabel'

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
const Label = ({ children, props }: ILabel) => {
	const { labelFor, label, subLabel, isOptional, isFulfilled } = props

	return (
		<div className="password-label">
			<RequiredLabel
				label={label}
				labelFor={labelFor}
				subLabel={subLabel}
				isOptional={isOptional}
				isFulfilled={isFulfilled}
			/>
			{children}
		</div>
	)
}

/**
 * Renders an input element
 * param linkRef - A ref to be attached to the input element
 * param rest - The remaining props to be passed to the input element
 *
 * returns An input element with the given props and ref
 */
const Input: FCProps<
	IInputElement & {
		id: string
		type: React.HTMLInputTypeAttribute
		linkRef?: React.Ref<HTMLInputElement>
	}
> = ({ linkRef, ...rest }) => {
	return (
		<input
			{...rest}
			ref={linkRef}
			autoFocus={false}
		/>
	)
}

interface IFormGroup extends IChildren {
	onSubmit: (e: React.FormEvent) => unknown
}
/**
 * Renders a form element
 * param children - The child components to be rendered inside the form
 * param onSubmit - A callback function that is triggered when the form is submitted
 *
 * returns A form element with an onSubmit event handler containing the child components
 */
export const FormGroup = ({ children, onSubmit }: IFormGroup) => {
	return <form onSubmit={onSubmit}>{children}</form>
}

FormGroup.Label = Label
FormGroup.Input = Input
