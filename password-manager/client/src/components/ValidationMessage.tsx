import type { TValidation } from '@/types'
export interface IValidationMessage<T = TValidation> {
	isVisible: boolean
	title?: string
	validations: T[]
}
/**
 * This function returns a validation message component that displays a title and a list of validation messages.
 * param {boolean} isVisible - Determines if the validation message is visible or not.
 * param {string} title - The title of the validation message.
 * param {Array<TValidation>} validations - An array of validation objects containing an isValid property and a message property.
 * returns {JSX.Element} A React component that displays the title and list of validation messages.
 */
export function ValidationMessage({ isVisible, title, validations }: IValidationMessage) {
	return (
		<>
			{title && isVisible && <span className="small">{title}</span>}
			<ul className="x-small fa-ul">
				{validations && isVisible
					? validations.map(({ message, isValid }, idx) => (
							<li key={idx}>
								<i
									style={{ animationDelay: `${idx * 0.1}s` }}
									className={`smooth small fa-li fa ${
										isValid ? 'fa-check scale-up' : 'fa-close scale-down spins'
									}`}
								/>
								{message}
							</li>
					  ))
					: null}
			</ul>
		</>
	)
}
