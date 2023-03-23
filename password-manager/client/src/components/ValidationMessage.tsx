import { FCProps, IValidationMessage } from '@/types'
/**
 * This function returns a validation message component that displays a title and a list of validation messages.
 * @param {boolean} isVisible - Determines if the validation message is visible or not.
 * @param {string} title - The title of the validation message.
 * @param {Array<Object>} validations - An array of validation objects containing an isValid property and a message property.
 * @returns {JSX.Element} A React component that displays the title and list of validation messages.
 */
export const ValidationMessage: FCProps<IValidationMessage> = ({
	isVisible,
	title,
	validations,
}) => {
	return (
		<div>
			{title && isVisible && <span className="small">{title}</span>}
			<ul className="xsmall fa-ul">
				{validations && isVisible
					? validations.map(({ message, isValid }, idx) => (
							<li key={idx}>
								<i
									style={{ animationDelay: `${idx * 0.1}s` }}
									className={`smooth small fa-li fa ${
										isValid ? 'fa-check scaleup' : 'fa-close scaledown spins'
									}`}
								/>
								{message}
							</li>
					  ))
					: null}
			</ul>
		</div>
	)
}
