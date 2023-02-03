import { ACTION_TYPES, CSSColorProp } from '../types';

const newGame = () => {
	return {
		type: ACTION_TYPES.NEW_GAME,
	};
};

const revealAnswer = (answer: CSSColorProp) => {
	return {
		type: ACTION_TYPES.REVEAL,
		payload: answer,
	};
};

const incrementGameCounter = () => {
	return {
		type: ACTION_TYPES.INCREMENT_GAME_COUNTER,
	};
};

export const ColorGameActions = {
	revealAnswer,
	newGame,
	incrementGameCounter,
};
