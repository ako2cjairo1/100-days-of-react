import { IChildren, IInputElement, IRequiredLabelProps, TFunction } from '@/types'
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
function Label({ children, props }: ILabel) {
	return (
		<div className="password-label">
			<RequiredLabel {...props} />
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
function Input({ linkRef, ...rest }: IInputElement) {
	return (
		<input
			{...rest}
			ref={linkRef}
			autoFocus={false}
		/>
	)
}

interface IFormGroup extends IChildren {
	onSubmit: TFunction<[e: React.FormEvent]> //(e: React.FormEvent) => unknown
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
