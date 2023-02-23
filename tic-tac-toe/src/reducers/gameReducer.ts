import { EMPTY_BOXES, init, INIT_PAWNS } from '../hooks/useTicTacToe'
import { ActionProps, GAME_ACTION, GAME_STATUS, PAWN, StateProps } from '../types'

export const gameReducer = (state: StateProps, action: ActionProps): StateProps => {
	const { type } = action
	const { Playing, Waiting, Tallying } = GAME_STATUS

	switch (type) {
		case GAME_ACTION.InitializeGame:
			return {
				...state,
				boxes: EMPTY_BOXES,
				gameStatus: Playing,
				players: action.players,
			}

		case GAME_ACTION.MovePosition:
			return {
				...state,
				gameStatus: Playing,
				boxes: state.boxes.map((pawn, idx) => (idx === action.index ? state.currentPawn : pawn)),
			}

		case GAME_ACTION.NewGame:
			// toggle the first pawn to move based from previous "start pawn"
			const pawn = INIT_PAWNS.filter(newPawn => newPawn !== state.startPawn)[0]
			return {
				...state,
				boxes: EMPTY_BOXES,
				gameStatus: Playing,
				winningMatch: init.winningMatch,
				startPawn: pawn,
				currentPawn: pawn,
			}

		case GAME_ACTION.SetWinningMatch:
			return {
				...state,
				winningMatch: action.combinations,
			}

		case GAME_ACTION.UpdateScoreBoard:
			const scores = state.scores
			const winner = action.winner

			return {
				...state,
				gameStatus: Tallying,
				scores: {
					...scores,
					[winner]: scores[winner] + 1,
				},
			}

		case GAME_ACTION.ToggleCurrentPawn:
			return {
				...state,
				currentPawn: state.currentPawn === PAWN['⚪️'] ? PAWN['❌'] : PAWN['⚪️'],
			}

		case GAME_ACTION.Waiting:
			return {
				...state,
				gameStatus: action.isWaiting ? Waiting : Playing,
			}
		default:
			return state
	}
}
