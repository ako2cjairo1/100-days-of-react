import { Board, ChoosePawn, ScoreBoard, Status } from '.'
import { useGameContext } from '../../hooks/useGameContext'
import classNames from '../../modules/Game.module.css'
import { GAME_STATUS } from '../../types'

export default () => {
	// extract classnames from css module
	const { main, header, status } = classNames
	// extract states from custom hook
	const { state } = useGameContext()
	const { boxes, currentPawn, players, scores, gameStatus } = state
	const { AssignPawn } = GAME_STATUS

	return (
		<main className={main}>
			<div className={header}>
				{gameStatus === AssignPawn ? (
					<ChoosePawn
						styles={classNames}
						currentPawn={currentPawn}
					/>
				) : (
					<ScoreBoard
						styles={classNames}
						players={players}
						scores={scores}
					/>
				)}
			</div>
			<div className={status}>
				<Status
					styles={classNames}
					gameStatus={gameStatus}
					players={players}
					currentPawn={currentPawn}
				/>
			</div>
			<Board boxes={boxes} />
		</main>
	)
}
