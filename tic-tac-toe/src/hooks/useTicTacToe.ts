import { useEffect, useReducer } from 'react'
import confetti from 'canvas-confetti'
import { gameReducer } from '../reducers/gameReducer'
import { gameActions } from '../actions'
import { executeAfterSomeTime, pickRandom } from '../helper/Helper'
import {
	BoxProps,
	ContextProps,
	TBox,
	TScore,
	TPawn,
	PLAYER,
	StateProps,
	GAME_STATUS,
	PAWN,
} from '../types'

// initial pawns to choose from
export const INIT_PAWNS: TPawn[] = [PAWN['⚪️'], PAWN['❌']]
// choose random pawn to make 1st move
const START_PAWN = pickRandom(INIT_PAWNS).value
export const EMPTY_BOXES = new Array<TBox>(9).fill(null)
const WIN_COMBINATIONS = [
	[0, 1, 2],
	[0, 3, 6],
	[0, 4, 8],
	[1, 4, 7],
	[2, 4, 6],
	[2, 5, 8],
	[3, 4, 5],
	[6, 7, 8],
]

const { AssignPawn, Playing } = GAME_STATUS
const { Computer, Human } = PLAYER

export const initialState: StateProps = {
	boxes: INIT_PAWNS,
	startPawn: START_PAWN,
	currentPawn: START_PAWN,
	gameStatus: AssignPawn,
	players: {
		Human: PAWN['⚪️'],
		Computer: PAWN['❌'],
	},
	scores: {
		[PAWN['❌']]: 0,
		[PAWN['⚪️']]: 0,
		draw: 0,
	},
	winningMatch: [],
}

export const useTicTacToe = (): ContextProps => {
	const [gameState, dispatcher] = useReducer(gameReducer, initialState)
	const { boxes, currentPawn, gameStatus, winningMatch, players, scores } = gameState
	// action creators
	const {
		initGame,
		movePosition,
		newGame,
		setIsWaiting,
		setWinningMatch,
		toggleCurrentPawn,
		updateScoreBoard,
	} = gameActions(dispatcher)

	useEffect(() => {
		if (gameStatus === Playing) {
			const winner = checkMove()

			if (winner) {
				// show confetti if Human player won
				if (winner === players[Human]) {
					confetti({
						particleCount: 150,
						spread: 60,
					})
				}
				// game has ended, update the scores
				updateScoreBoard(winner as keyof TScore)
				// start a new game after 3s
				executeAfterSomeTime(newGame, 3)
			} else {
				computerMove()
			}
		}
	}, [currentPawn, gameStatus])

	const checkMove = (): string | null => {
		const winningMatch = WIN_COMBINATIONS.find(combination => {
			return (
				// 1. 1st index is not null and..
				boxes[combination[0]] !== null &&
				// 2. value of 2nd index is equal to the 1st and..
				boxes[combination[0]] === boxes[combination[1]] &&
				// 3. value of 3rd index is equal to the 1st (or 2nd)
				boxes[combination[0]] === boxes[combination[2]]
			)
		})

		if (winningMatch) {
			setWinningMatch(winningMatch.slice())
			// return the winning pawn
			return boxes[winningMatch[0]]
		}

		return boxes.every(box => box !== null) ? 'draw' : ''
	}

	const moveToPosition = (index: number) => {
		if (gameStatus === Playing && boxes[index] === null) {
			movePosition(index)
			toggleCurrentPawn()
		}
	}

	const humanMove = ({ idx, pawn }: BoxProps) => {
		if (gameStatus === AssignPawn) {
			// choose pawn before starting the game
			if (pawn === PAWN['⚪️']) {
				initGame({ Human: PAWN['⚪️'], Computer: PAWN['❌'] })
			} else {
				initGame({ Computer: PAWN['⚪️'], Human: PAWN['❌'] })
			}
		} else {
			moveToPosition(idx)
		}
	}

	const computerMove = () => {
		if (currentPawn === players[Computer]) {
			setIsWaiting(true)

			executeAfterSomeTime(() => {
				let randMove = pickRandom(boxes)
				// pick a random valid move
				while (boxes[randMove.index] !== null) {
					randMove = pickRandom(boxes)
				}
				moveToPosition(randMove.index)
			}, pickRandom([1, 2, 3]).value)
		}
	}

	return {
		state: {
			boxes,
			currentPawn,
			gameStatus,
			winningMatch,
			players,
			scores,
		},
		handlers: {
			humanMove,
		},
	}
}
