import { FCProps, ISubmitButton } from '@/types'
/**
 * This is a SubmitButton component that renders a button with text and an optional icon.
 * Note: "type" attribute was omitted, most of the button attrs are omitted
 *
 * @param {boolean} submitted - A boolean indicating whether or not the button is in a submitted state.
 * @param {string} [textStatus='Processing...'] - The text to display when the button is in a submitted state.
 * @param {string} [iconName] - The name of the icon to display on the button (optional).
 */
export const SubmitButton: FCProps<ISubmitButton> = ({
	children,
	className,
	submitted = false,
	disabled = false,
	textStatus = 'Processing...',
	iconName,
	...props
}) => {
	return (
		<button
			data-testid="submit"
			type="submit"
			className={`submit ${className ? className : ''}`}
			disabled={disabled}
			onClick={props.onClick}
			{...props}
		>
			{submitted ? (
				<div className="center">
					{/* <div
						data-testid="spinner"
						className="spinner"
					/> */}
					<i
						className="fa fa-spinner spinner"
						data-testid="spinner"
						aria-hidden="true"
					></i>
					{textStatus}
				</div>
			) : (
				<>
					{iconName && (
						<i
							data-testid={iconName}
							className={`fa ${iconName}`}
						/>
					)}{' '}
					{children ? children : 'Submit'}
				</>
			)}
		</button>
	)
}
