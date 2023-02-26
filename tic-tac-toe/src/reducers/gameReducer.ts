import { EMPTY_BOXES, initialState, INIT_PAWNS } from '../hooks/useTicTacToe'
import { ActionProps, GAME_ACTION, GAME_STATUS, PAWN, StateProps } from '../types'

export const gameReducer = (state: StateProps, action: ActionProps): StateProps => {
	const { Playing, Processing, Tallying } = GAME_STATUS
	const {
		InitializeGame,
		MovePosition,
		NewGame,
		SetWinningMatch,
		ToggleCurrentPawn,
		UpdateScoreBoard,
		Waiting,
	} = GAME_ACTION

	const { boxes, currentPawn, startPawn, scores } = state
	const { type } = action

	switch (type) {
		case InitializeGame:
			const { players } = action.payload
			return {
				...state,
				boxes: EMPTY_BOXES,
				gameStatus: Playing,
				players,
			}

		case MovePosition:
			const { index } = action.payload
			return {
				...state,
				boxes: boxes.map((pawn, idx) => (idx === index ? currentPawn : pawn)),
				gameStatus: Playing,
			}

		case NewGame:
			// toggle the first pawn to move based from previous "start pawn"
			const pawn = INIT_PAWNS.filter(newPawn => newPawn !== startPawn)[0]
			return {
				...state,
				boxes: EMPTY_BOXES,
				gameStatus: Playing,
				winningMatch: initialState.winningMatch,
				startPawn: pawn,
				currentPawn: pawn,
			}

		case SetWinningMatch:
			const { combinations } = action.payload
			return {
				...state,
				winningMatch: combinations,
			}

		case UpdateScoreBoard:
			const { winner } = action.payload
			return {
				...state,
				gameStatus: Tallying,
				scores: {
					...scores,
					[winner]: scores[winner] + 1,
				},
			}

		case ToggleCurrentPawn:
			return {
				...state,
				currentPawn: currentPawn === PAWN['⚪️'] ? PAWN['❌'] : PAWN['⚪️'],
			}

		case Waiting:
			const { isWaiting } = action.payload
			return {
				...state,
				gameStatus: isWaiting ? Processing : Playing,
			}
		default:
			return state
	}
}
