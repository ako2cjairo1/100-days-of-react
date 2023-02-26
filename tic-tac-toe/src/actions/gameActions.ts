import React from 'react'
import { ActionProps, GAME_ACTION, TPawn, TPlayers, TScore } from '../types'

export const gameActions = (dispatch: React.Dispatch<ActionProps>) => {
	return {
		// game actions
		initGame: (players: TPlayers) =>
			dispatch({
				type: GAME_ACTION.InitializeGame,
				payload: { players },
			}),
		newGame: () =>
			dispatch({
				type: GAME_ACTION.NewGame,
			}),
		movePosition: (index: number) =>
			dispatch({
				type: GAME_ACTION.MovePosition,
				payload: { index },
			}),
		setWinningMatch: (combinations: number[]) =>
			dispatch({
				type: GAME_ACTION.SetWinningMatch,
				payload: { combinations },
			}),
		updateScoreBoard: (winner: keyof TScore) =>
			dispatch({
				type: GAME_ACTION.UpdateScoreBoard,
				payload: { winner },
			}),
		toggleCurrentPawn: () =>
			dispatch({
				type: GAME_ACTION.ToggleCurrentPawn,
			}),
		setIsWaiting: (isWaiting: boolean) =>
			dispatch({
				type: GAME_ACTION.Waiting,
				payload: { isWaiting },
			}),
	}
}
