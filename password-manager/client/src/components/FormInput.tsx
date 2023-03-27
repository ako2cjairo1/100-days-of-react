import { REGISTER_STATE } from '@/services/constants'
import { MergeRegExObj } from '@/services/Utils/password-manager.helper'
import { FCProps, IFormInput } from '@/types'
import { ValidationMessage, RequiredLabel, PasswordStrength } from '.'

/**
 * This is a compound react component that composes of a Label, Input type and a Validation component.
 * param {Object} props - The properties of the FormInput component.
 * param {boolean} props.isFocused - Determines if the input is focused.
 * param {boolean} props.isValid - Determines if the input is valid.
 * param {Object} props.linkRef - The reference to the input element.
 * param {Array} props.validations - The array of validation messages.
 * returns {JSX.Element} The FormInput component.
 */
const { PASSWORD_REGEX } = REGISTER_STATE

export const FormInput: FCProps<IFormInput> = ({
	isFocused,
	isValid,
	linkRef,
	validations,
	havePasswordMeter,
	...inputProps
}) => {
	const { id, title, value, label, subLabel, isOptional, placeholder } = inputProps
	return (
		<>
			{label && (
				<div className="password-label">
					<RequiredLabel
						label={label}
						labelFor={id}
						subLabel={subLabel}
						isOptional={isOptional}
						isFulfilled={isValid}
					/>
					{havePasswordMeter ? (
						<PasswordStrength
							password={value as string}
							regex={MergeRegExObj(PASSWORD_REGEX)}
						/>
					) : null}
				</div>
			)}

			<input
				{...inputProps}
				placeholder={placeholder ? placeholder : label}
				ref={linkRef}
				autoFocus={false}
			/>

			{validations && (
				<ValidationMessage
					title={title}
					isVisible={!isFocused && !isValid}
					validations={validations}
				/>
			)}
		</>
	)
}
