type InputValidationProps = {
	isValid: boolean
	message: string
}

export const ValidationMessage = ({
	isVisible,
	title,
	validations,
}: {
	isVisible: boolean
	title?: string
	validations: InputValidationProps[]
}) => {
	return (
		<>
			{title && isVisible && <span className="small">{title}</span>}
			<ul className="xsmall fa-ul">
				{validations && isVisible
					? validations.map(({ isValid, message }, idx) => (
							<li key={idx}>
								<i
									style={{ animationDelay: `${idx * 0.1}s` }}
									className={`smooth scaleup small fa-li fa ${
										isValid ? 'fa-check scaledown' : 'fa-exclamation-circle'
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
