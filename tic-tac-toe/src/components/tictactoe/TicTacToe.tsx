import { Board, ChoosePawn, ScoreBoard, Status } from '.'
import { useGameContext } from '../../hooks/useGameContext'
import styles from '../../modules/Game.module.css'
import { GAME_STATUS } from '../../types'

export default () => {
	// extract classnames from css module
	const { main, header } = styles
	// extract states from custom hook
	const { state } = useGameContext()
	const { boxes, currentPawn, players, scores, gameStatus } = state
	const { AssignPawn } = GAME_STATUS

	return (
		<main className={main}>
			<div className={header}>
				{gameStatus === AssignPawn ? (
					<ChoosePawn {...{ styles, currentPawn }} />
				) : (
					<ScoreBoard {...{ styles, players, scores }} />
				)}
			</div>
			<Status {...{ styles, gameStatus, players, currentPawn }} />
			<Board {...{ boxes }} />
		</main>
	)
}
