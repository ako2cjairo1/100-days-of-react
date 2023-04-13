import { ISubmitButton } from '@/types'
import { AnimatedIcon } from './AnimatedIcon'
/**
 * This is a SubmitButton component that renders a button with text and an optional icon.
 * Note: "type" attribute was omitted, most of the button attrs are omitted
 *
 * @param {boolean} submitted - A boolean indicating whether or not the button is in a submitted state.
 * @param {string} [textStatus='Processing...'] - The text to display when the button is in a submitted state.
 * @param {string} [iconName] - The name of the icon to display on the button (optional).
 */
export function SubmitButton({
	children,
	className,
	props: {
		variant = 'primary',
		submitted = false,
		disabled = false,
		textStatus = '',
		iconName = '',
	},
	...rest
}: ISubmitButton) {
	const isPrimary = variant === 'primary'
	return (
		<button
			data-testid="submit"
			type={isPrimary ? 'submit' : 'button'}
			className={`button-style submit ${isPrimary && 'accent-bg'} ${className && className}`}
			disabled={disabled}
			onClick={rest.onClick}
			{...rest}
		>
			{submitted ? (
				<div className="center">
					<AnimatedIcon
						data-testid="spinner"
						animation="fa-spin"
						animateOnLoad
						iconName="fa fa-spinner"
					/>
					{textStatus}
				</div>
			) : (
				<>
					{iconName && (
						<AnimatedIcon
							data-testid={iconName}
							iconName={iconName}
						/>
					)}{' '}
					{children}
				</>
			)}
		</button>
	)
}
