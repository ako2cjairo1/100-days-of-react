import { GAME_STATUS, StatusProps } from '../../types'

export const Status = ({ styles, gameStatus, players, currentPawn }: StatusProps) => {
	const { status, hourglass } = styles
	const { Computer } = players
	const { Processing, Tallying } = GAME_STATUS

	return (
		<div className={status}>
			{gameStatus === Processing && currentPawn === Computer ? (
				<p>
					<span className={hourglass}>⏳</span> Computer is deciding a move...
				</p>
			) : gameStatus !== Tallying && (
				<p>Your turn...</p>
			)}
		</div>
	)
}
