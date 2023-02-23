import { GAME_STATUS, StatusProps } from '../../types'

export const Status = ({ styles, gameStatus, players, currentPawn }: StatusProps) => {
	const { Computer } = players
	const { Waiting } = GAME_STATUS

	return (
		<>
			{gameStatus === Waiting && currentPawn === Computer ? (
				<p>
					<span className={styles.hourglass}>⏳</span> Computer is deciding a move...
				</p>
			) : null}
		</>
	)
}
