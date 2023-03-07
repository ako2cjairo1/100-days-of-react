import processingGif from '../../assets/processing.gif'
import styles from '../../modules/Loader.module.css'

export const Loader = () => {
	return (
		<div className={styles.loader}>
			<img src={processingGif} />
			<h3>The game is loading</h3>
			<p>Please standby...</p>
		</div>
	)
}
