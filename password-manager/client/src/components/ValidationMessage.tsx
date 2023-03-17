type InputValidationProps = {
	isValid: boolean
	message: string
}

export const ValidationMessage = ({
	isVisible,
	validations,
}: {
	isVisible: boolean
	validations: InputValidationProps[]
}) => {
	return (
		<ul className="xsmall fa-ul">
			{validations.length && isVisible
				? validations.map(({ isValid, message }, idx) => (
						<li key={idx}>
							<i
								style={{ animationDelay: `${idx * 0.1}s` }}
								className={`smooth scaleup small fa-li fa ${
									isValid ? 'fa-check-circle scaledown' : 'fa-exclamation-circle'
								}`}
							/>
							{message}
						</li>
				  ))
				: null}
		</ul>
	)
}
