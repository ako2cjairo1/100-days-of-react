import { useReducer } from 'react';
import { ColorGameActions } from '../actions';
import { colorGameReducer, initialState } from '../reducers';
import { CSSColorProp } from '../types';

export const useColorGame = () => {
	const [colorGameState, dispatch] = useReducer(colorGameReducer, initialState);
	const { newGame, revealAnswer, incrementGameCounter } = ColorGameActions;

	const startGame = () => {
		dispatch(incrementGameCounter());
		const timeout = setTimeout(
			() => {
				dispatch(newGame());
				clearTimeout(timeout);
			},
			// load quickly (200ms) at the beginning of game
			colorGameState.gameCounter <= -1 ? 200 : 3000
		);
	};

	const handleReveal = (answer: CSSColorProp) => {
		dispatch(revealAnswer(answer));
		startGame();
	};

	return { colorGameState, handleReveal, startGame };
};
