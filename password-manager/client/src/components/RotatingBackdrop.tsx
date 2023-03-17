import styles from '@/assets/modules/RotatingBackdrop.module.css'

export const RotatingBackdrop = () => {
	const { background, shape } = styles
	return (
		<div className={background}>
			<div className={shape}></div>
			<div className={shape}></div>
		</div>
	)
}
