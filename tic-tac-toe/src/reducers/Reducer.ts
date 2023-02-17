import { EMPTY_BOXES, initialValue, PAWNS } from "../hooks/useTicTacToe";
import { ActionProps, ACTIONS, PayloadTypes, StateProps } from "../types";

export const gameReducer = (state: StateProps, action: ActionProps<PayloadTypes>): StateProps => {
    const {type, payload} = action

    switch(type){
        case ACTIONS.INIT_CHOOSE_PAWN:
            return {
                ...state,
                boxes: EMPTY_BOXES,
                start: true, 
                players: payload.players ? payload.players : state.players
            }

        case ACTIONS.MOVE_POSITION:
            return  {
                ...state,
                isWaiting: false,
                boxes: state.boxes.map((val, idx) => (idx === payload.index ? state.currentPawn : val))
            }

        case ACTIONS.NEW_GAME:
            const pawn = PAWNS.filter((newPawn) => newPawn !== state.startPawn)[0]
            return {
                ...state,
                boxes: EMPTY_BOXES,
                isWaiting: false,
                start: true,
                matched: initialValue.state.matched,
                startPawn: pawn,
                currentPawn: pawn
            }

        case ACTIONS.SET_MATCHED:
            return {
                ...state,
                matched: payload.combinations ? payload.combinations : state.matched
            }

        case ACTIONS.UPDATE_SCORE_BOARD:
            const scores = state.scores
            const winner = payload.winner ? payload.winner : null
            if(winner){
                return {
                    ...state,
                    start: false,
                    scores: { ...state.scores, [winner]: scores[winner] + 1}
                }
            }
            return state

        case ACTIONS.TOGGLE_PAWN:
            return {
                ...state,
                currentPawn: payload.pawn ? payload.pawn : state.currentPawn
            }
        
        case ACTIONS.SET_IS_WAITING:
            return {
                ...state,
                isWaiting: payload.isWaiting ? payload.isWaiting : state.isWaiting
            }
        default:
            return state
    }
}