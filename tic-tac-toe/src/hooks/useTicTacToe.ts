import { useEffect, useReducer } from "react";
import { movePosition, newGame, toggleCurrentPawn, initGame, updateScoreBoard, setWinningMatch, setIsWaiting } from "../actions";
import { gameReducer } from "../reducers/Reducer";
import { executeAfterSomeTime, pickRandom } from "../Helper";
import { BoxProps, ContextProps, EnumPawns,  TBox,  TScore } from "../types";
import confetti from "https://cdn.skypack.dev/canvas-confetti@1";

// initial box content without null for player to choose which pawn they would use
export const PAWNS: EnumPawns[] = ["❌","⚪️"]
const START_PAWN = PAWNS[pickRandom(PAWNS.length)]
export const EMPTY_BOXES = new Array<TBox>(9).fill(null);
const WIN_COMBINATIONS = [
	[0, 1, 2],
	[0, 3, 6],
	[0, 4, 8],
	[1, 4, 7],
	[2, 4, 6],
	[2, 5, 8],
	[3, 4, 5],
	[6, 7, 8],
];


export const initialValue: ContextProps = {
    state: {
        boxes: PAWNS,
		startPawn: START_PAWN,
        // choose random pawn to make 1st move
        currentPawn: START_PAWN,
        isReset: true,
        isWaiting: false,
        players: { player: "❌", computer:"⚪️" },
        scores: {"❌": 0, "⚪️": 0, draw: 0},
        start: false,
        matched: [],
    },
    handlers: {
        playerMove: () => {},
    }
};

export const useTicTacToe = (): ContextProps => {
    const [state, setState] = useReducer(gameReducer, initialValue.state)
    const { boxes, currentPawn, isWaiting, matched, players, scores, start, startPawn } = state

	useEffect(() => {
		if (start) {
			let winner = checkMove();

			if (winner) {
				if(winner === players.player) {
					confetti({
						particleCount: 150,
						spread: 60
					  });
				}
				// game has ended, update the scores
				setState(updateScoreBoard(winner as keyof TScore))
				// start a new game after 3s
				executeAfterSomeTime(() => setState(newGame(currentPawn)), 3)
			}
			else {
				computerMove()
			}
		}
	}, [currentPawn, start]);

	const checkMove = () => {
		let winner = !boxes.includes(null) ? 'draw' : null;

		WIN_COMBINATIONS.forEach((combination) => {
			if (
				// 1. 1st index is not null and..
				boxes[combination[0]] !== null &&
				// 2. value of 2nd index is equal to the 1st and..
				boxes[combination[0]] === boxes[combination[1]] &&
				// 3. value of 3rd index is equal to the 1st (or 2nd)
				boxes[combination[0]] === boxes[combination[2]]
			) {
				// return the winning pawn
				winner = boxes[combination[0]];
				// get winning indexes to animate the boxes
				setState(setWinningMatch(combination.slice()))
			}
		});

		return winner;
	};

	const isReset = Object.values(scores).every((score) => score === 0);

	const moveToPosition = (position: number) => {
        if(start && boxes[position] === null){
            setState(movePosition(position))
            setState(toggleCurrentPawn(currentPawn === "❌" ? "⚪️" : "❌"))
		} 
	}
	
	const playerMove = ({boxIdx, pawn}: BoxProps) => {
		if (!start && isReset) {
			// choose pawn before starting the game
			if (pawn ==="⚪️") {
                setState(initGame({ player: "⚪️", computer: "❌" }))
			} else {
                setState(initGame({ computer: "⚪️", player: "❌" }))
            }
		} else {
			moveToPosition(boxIdx)
		}
	};

	const computerMove = () => {
		if(players.computer === currentPawn) {
			setState(setIsWaiting(true))

			executeAfterSomeTime(() => {
				let randMove = pickRandom(9)
				while (boxes[randMove] !== null) {
					// pick a valid random move
					randMove = pickRandom(9)
				}
				moveToPosition(randMove);
			}, [1,2,3][pickRandom(3)])
		}
	}

    return {
        state: {
           boxes,
		   startPawn,
           currentPawn,
           isReset,
           isWaiting,
           matched,
           players,
           scores,
           start,
        },
        handlers: {
            playerMove
        }
    }
}