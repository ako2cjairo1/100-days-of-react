import { createContext, useEffect, useState } from 'react';
import { BoxProps, ChildrenProps, ContextProps, EnumPawns, TBox, TPlayers, TScore } from '../types';

// initial box content without null for player to choose which pawn they would use
const PAWNS: EnumPawns[] = ['X','O']
const EMPTY_BOXES = new Array<TBox>(9).fill(null);
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

const initialValue: ContextProps = {
	boxes: PAWNS,
	// choose random pawn to make 1st move
	currentPawn: PAWNS[pickRandom(PAWNS.length)],
	isReset: true,
	players: { player: 'X', computer: 'O' },
	scores: { X:0, O: 0, draw: 0 },
	start: false,
	matched: [],
	playerMove: () => {},
};

function pickRandom(len: number) {
	return Math.floor(Math.random() * len)
}	

export const TicTacToeContext = createContext<ContextProps>(initialValue);

const {boxes: initBoxes, currentPawn: initCurrentPawn, players: initPlayers, scores: initScores, start: initStart, matched: initMatched} = initialValue

export const TicTacToeProvider = ({ children }: ChildrenProps) => {
	const [start, setStart] = useState<boolean>(initStart);
	const [boxes, setBoxes] = useState<TBox[]>(initBoxes);
	const [currentPawn, setCurrentPawn] = useState<EnumPawns>(initCurrentPawn);
	const [players, setPlayers] = useState<TPlayers>(initPlayers);
	const [scores, setScores] = useState<TScore>(initScores);
	const [matched, setMatched] = useState<number[]>(initMatched)
	const [startPawn, setStartPawn] = useState<EnumPawns>()


	useEffect(() => {
		if (start) {
			let winner = checkMove();
			if (winner) {
				// game has ended, update the scores
				updateScoreBoard(winner as keyof TScore);
				const timeout = setTimeout(() => {
					createNewGame();
					clearTimeout(timeout);
				}, 3000);
			}
			else {
				computerMove()
			}
		}
	}, [currentPawn, start]);

	const updateScoreBoard = (winner: keyof TScore) => {
		setStart(false)
		// increment scores
		setScores((prevScore) => ({ ...prevScore, [winner]: prevScore[winner] + 1 }));
		// if (winner === 'draw') alert("It's a tie!");
		// else alert(`${winner} won!`);
	};	

	const createNewGame = () => {
		setStart(true)
		setMatched(initMatched)

		// toggle which pawn to move first
		const newStart = PAWNS.filter((newPawn) => newPawn !== startPawn)[0]
		setStartPawn(newStart)
		setCurrentPawn(newStart)
		setBoxes(EMPTY_BOXES);
	};

	const togglePlayer = () => {
		setCurrentPawn((prevPawn) => (prevPawn === 'X' ? 'O' : 'X'));
		return currentPawn;
	};

	const isNoMoves = !boxes.includes(null);

	const checkMove = () => {
		let winner = isNoMoves ? 'draw' : null;
		WIN_COMBINATIONS.forEach((combination) => {
			if (
				// 1. 1st index is not null and..
				boxes[combination[0]] !== null &&
				// 2. value of 2nd index is equal to the 1st and..
				boxes[combination[0]] === boxes[combination[1]] &&
				// 3. value of 3rd index is equal to the 1st (or 2nd)
				boxes[combination[0]] === boxes[combination[2]]
			) {
				// return the winner by getting the value of 3 boxes that matched
				winner = boxes[combination[0]];
				setMatched(combination.slice())
			}
		});

		return winner;
	};

	const isReset = Object.values(scores).every((score) => score === 0);

	const moveToPosition = (position: number) => {
		if(start && boxes[position] === null){
			setBoxes(boxes.map((val, idx) => (idx === position ? togglePlayer() : val)));
		} 
	}
	const playerMove = ({boxIdx, pawn}: BoxProps) => {
		// choose pawn before starting the game
		if (!start && isReset) {
			if (pawn === 'O') {
				setPlayers({ player: 'O', computer: 'X' })
			}
			setStart(true);
			// create a blank board
			setBoxes(EMPTY_BOXES);
			setStartPawn(initCurrentPawn)
		} else {
			// update the board using the pawn assigned to current player then toggle to next player
			moveToPosition(boxIdx)
		}
	};

	const computerMove = () => {
		if(players.computer === currentPawn) {
			const timeout = setTimeout(() => {
				let randMove = pickRandom(9)
				// pick a valid random move
				while (boxes[randMove] !== null) {
					randMove = pickRandom(9)
				}
				moveToPosition(randMove);	
				clearTimeout(timeout)
			}, 1000)
		}
	}

	return (
		<TicTacToeContext.Provider value={{ boxes, currentPawn, isReset, players, scores, start, matched, playerMove }}>
			{children}
		</TicTacToeContext.Provider>
	);
};
