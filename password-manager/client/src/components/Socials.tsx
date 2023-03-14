import styles from '../modules/Socials.module.css'

export const Socials = () => {
	const { social, apple, fb } = styles

	const handleExternalAuth = () => {
		alert('TODO: Implement external authentication.')
	}
	return (
		<>
			<div className="separator">
				<div className="line"></div>
				<p>OR</p>
				<div className="line"></div>
			</div>
			<p className="center small">Continue with...</p>
			<footer className={social}>
				<button
					className={apple}
					onClick={handleExternalAuth}
				>
					<i className="fab fa-apple"></i> Apple
				</button>
				<button onClick={handleExternalAuth}>
					<i className="fab fa-google"></i> Google
				</button>
				<button
					className={fb}
					onClick={handleExternalAuth}
				>
					<i className="fab fa-facebook"></i> Facebook
				</button>
			</footer>
		</>
	)
}
