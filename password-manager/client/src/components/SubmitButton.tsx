import { IButtonElement } from '@/types'
/**
 * This is a SubmitButton component that renders a button with text and an optional icon.
 * Note: "type" attribute was omitted, most of the button attrs are omitted
 *
 * @param {boolean} submitted - A boolean indicating whether or not the button is in a submitted state.
 * @param {string} [textStatus='Processing...'] - The text to display when the button is in a submitted state.
 * @param {string} [iconName] - The name of the icon to display on the button (optional).
 */
export function SubmitButton({
	props: { variant = 'primary', submitted = false, disabled = false, textStatus, iconName },
	children,
	className,
	...rest
}: IButtonElement) {
	return (
		<button
			data-testid="submit"
			type={variant !== 'primary' ? 'button' : 'submit'}
			className={`button-style submit ${variant === 'primary' ? 'accent-bg' : ''} ${
				className ? className : ''
			}`}
			disabled={disabled}
			onClick={rest.onClick}
			{...rest}
		>
			{submitted ? (
				<div className="center">
					<i
						className="fa fa-spinner fa-spin spinner"
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
					{children}
				</>
			)}
		</button>
	)
}
