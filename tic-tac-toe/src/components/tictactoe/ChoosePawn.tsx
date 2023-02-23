import { ChoosePawnProps } from '../../types'

export const ChoosePawn = ({ styles, currentPawn }: ChoosePawnProps) => {
	return (
		<>
			<p className={styles.menu}>Choose your pawn</p>
			<p className={`${styles.menu} ${styles.lower}`}>
				"<a>{currentPawn}</a>" will start first.
			</p>
		</>
	)
}
