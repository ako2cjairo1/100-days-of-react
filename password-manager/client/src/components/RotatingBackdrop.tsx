import styles from '@/assets/modules/RotatingBackdrop.module.css'
/**
 * RotatingBackdrop component
 * Renders a rotating backdrop with two shapes
 */
export const RotatingBackdrop = () => {
	const { background, shape } = styles

	return (
		<div className={background}>
			<div
				data-testid="shape"
				className={shape}
			></div>
			<div
				data-testid="shape"
				className={shape}
			></div>
		</div>
	)
}
