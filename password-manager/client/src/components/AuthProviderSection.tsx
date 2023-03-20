import styles from '@/assets/modules/Socials.module.css'

/**
 * Renders a section with buttons for external authentication providers.
 */
export const AuthProviderSection = () => {
	const { social, apple, fb } = styles

	const handleExternalAuth = () => {
		alert('TODO: Implement external authentication.')
	}
	return (
		<div
			data-testid="social"
			className={social}
		>
			<button
				// className={apple}
				onClick={handleExternalAuth}
			>
				<i className="fab fa-apple"></i> Apple
			</button>
			<button onClick={handleExternalAuth}>
				<i className="fab fa-google"></i> Google
			</button>
			<button
				// className={apple}
				onClick={handleExternalAuth}
			>
				<i className="fab fa-github"></i> Github
			</button>
		</div>
	)
}
