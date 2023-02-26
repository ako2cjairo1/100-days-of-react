import { useGameContext } from '../../hooks/useGameContext'
import classNames from '../../modules/Game.module.css'
import { BoxProps, GAME_STATUS } from '../../types'

export const Box = ({ idx, pawn }: BoxProps) => {
	const { box, active, inactive, win } = classNames
	const { Playing, Processing } = GAME_STATUS

	// extract states and handler from custom hook
	const { state, handlers } = useGameContext()
	const { gameStatus, winningMatch } = state
	const { humanMove } = handlers

	const winClass = winningMatch.includes(idx) ? win : pawn === null && inactive

	// disable button if Playing and already selected
	const disabled =
		gameStatus === GAME_STATUS.AssignPawn
			? false
			: gameStatus === Playing
				? gameStatus === Playing && pawn !== null
				: true

	return (
		<button
			className={`${box} ${disabled ? winClass : active}`}
			style={{ animationDelay: `${idx * 0.1}s` }}
			// disable if already selected OR is waiting
			disabled={disabled || gameStatus === Processing}
			onClick={() => humanMove({ idx, pawn })}
		>
			{pawn}
		</button>
	)
}
