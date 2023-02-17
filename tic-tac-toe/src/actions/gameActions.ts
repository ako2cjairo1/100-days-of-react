import { ActionProps, ACTIONS, EnumPawns, PayloadTypes, TPlayers, TScore } from '../types'

// action creator
const createAction = ({type, payload}: ActionProps<PayloadTypes>) => {
    return { 
        type, 
        payload
    }
}
// game actions
export const initGame = (players: TPlayers) => createAction({
    type: ACTIONS.INIT_CHOOSE_PAWN,
    payload: {
        players
    }
})
export const newGame = (pawn: EnumPawns) => createAction({ 
    type: ACTIONS.NEW_GAME,
    payload: { 
        pawn 
    }
})
export const movePosition = (index: number) => createAction({ 
    type: ACTIONS.MOVE_POSITION, 
    payload: {
        index
    } 
})
export const setWinningMatch = (combinations: number[]) => createAction({
    type: ACTIONS.SET_MATCHED,
    payload: {
        combinations
    }
})
export const setScoreBoard = (winner: keyof TScore) => createAction({
    type: ACTIONS.UPDATE_SCORE_BOARD,
    payload: {
        winner
    }
})
export const toggleCurrentPawn = (pawn: EnumPawns) => createAction({
    type: ACTIONS.TOGGLE_PAWN,
    payload: {
        pawn
    }
})
export const setIsWaiting = (isWaiting: boolean) => createAction({
    type: ACTIONS.SET_IS_WAITING,
    payload: {
        isWaiting
    }
})