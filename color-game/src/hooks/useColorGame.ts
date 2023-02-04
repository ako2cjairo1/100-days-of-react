import { useReducer } from 'react';
import { ColorGameActions } from '../actions';
import { colorGameReducer, initialState } from '../reducers';
import { UseColorGameProps } from '../types';

export const useColorGame = (colorCount: number): UseColorGameProps => {
	const [colorGameState, dispatch] = useReducer(colorGameReducer, initialState);
	const { newGame, revealAnswer, incrementGameCounter, disableOptions, endGame, startGame } =
		ColorGameActions;

	const handleNewGame = () => {
		dispatch(incrementGameCounter());
		const timeout = setTimeout(
			() => {
				dispatch(newGame(colorCount));
				clearTimeout(timeout);
			},
			// load quickly (200ms) at the beginning of game
			colorGameState.gameCounter <= -1 ? 200 : 3000
		);
	};

	const handleReveal = (isWin: boolean) => {
		dispatch(revealAnswer(isWin));
		handleNewGame();
	};

	const handleDisable = () => dispatch(disableOptions());

	const handleEndGame = () => dispatch(endGame());

	const handleStartGame = () => {
		dispatch(startGame());
		handleNewGame();
	};

	return {
		colorGameState,
		handleReveal,
		handleNewGame,
		handleDisable,
		handleEndGame,
		handleStartGame,
	};
};
