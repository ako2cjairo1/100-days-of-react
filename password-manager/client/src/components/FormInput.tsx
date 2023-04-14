import { REGISTER_STATE } from '@/services/constants'
import { MergeRegExObj } from '@/services/Utils/password-manager.helper'
import { ValidationMessage, RequiredLabel, PasswordStrength } from '.'
import { IInputElement, IRequiredLabelProps, IValidationMessage, TValidation } from '@/types'

interface IFormInput
	extends IInputElement,
		Pick<IRequiredLabelProps, 'label' | 'subLabel' | 'isOptional'>,
		Partial<Pick<IValidationMessage, 'title' | 'validations'>> {
	type: 'text' | 'password' | 'email'
	linkRef?: React.Ref<HTMLInputElement>
	havePasswordMeter?: boolean
	isValid?: boolean
	isFocused?: boolean
	validations?: TValidation[]
}
/**
 * This is a compound react component that composes of a Label, Input type and a Validation component.
 * param {Object} props - The properties of the FormInput component.
 * param {boolean} props.isFocused - Determines if the input is focused.
 * param {boolean} props.isValid - Determines if the input is valid.
 * param {Object} props.linkRef - The reference to the input element.
 * param {Array} props.validations - The array of validation messages.
 * returns {JSX.Element} The FormInput component.
 */
export function FormInput({
	isFocused,
	isValid,
	linkRef,
	validations,
	havePasswordMeter = true,
	type = 'text',
	...rest
}: IFormInput) {
	return (
		<div className="input-row">
			{rest.label && (
				<div className="password-label">
					<RequiredLabel
						label={rest.label}
						labelFor={rest.id}
						subLabel={rest.subLabel}
						isOptional={rest.isOptional}
						isFulfilled={isValid}
					/>
					{type === 'password' && havePasswordMeter ? (
						<PasswordStrength
							password={rest.value as string}
							regex={MergeRegExObj(REGISTER_STATE.PASSWORD_REGEX)}
						/>
					) : null}
				</div>
			)}

			<input
				type={type}
				{...rest}
				placeholder={rest.placeholder ? rest.placeholder : rest.label}
				ref={linkRef}
				autoFocus={false}
			/>

			{validations && (
				<ValidationMessage
					title={rest.title}
					isVisible={!isFocused && !isValid}
					validations={validations}
				/>
			)}
		</div>
	)
}
