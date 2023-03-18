type SubmitButtonProps = React.DetailedHTMLProps<
	React.ButtonHTMLAttributes<HTMLButtonElement>,
	HTMLButtonElement
> & {
	text?: string
	textStatus?: string
	iconName?: string
	submitted: boolean
}

export const SubmitButton = ({
	submitted = false,
	text = 'Submit',
	textStatus = 'Please standby...',
	iconName,
	...props
}: SubmitButtonProps) => {
	const { className } = props

	return (
		<button
			className={className ? className : 'submit'}
			type="submit"
			{...props}
		>
			{submitted ? (
				<div className="spinner" />
			) : (
				<>
					{iconName && <i className={`fa ${iconName}`} />} {text}
				</>
			)}
		</button>
	)
}
