import { ACTION_TYPES } from '../types';

const newGame = (colorCount: number) => {
	return {
		type: ACTION_TYPES.NEW_GAME,
		payload: colorCount,
	};
};

const revealAnswer = (isWin: boolean) => {
	return {
		type: ACTION_TYPES.REVEAL,
		payload: isWin,
	};
};

const incrementGameCounter = () => {
	return {
		type: ACTION_TYPES.INCREMENT_GAME_COUNTER,
	};
};

const disableOptions = () => {
	return {
		type: ACTION_TYPES.DISABLE,
	};
};

const endGame = () => {
	return {
		type: ACTION_TYPES.END,
	};
};

const startGame = () => {
	return {
		type: ACTION_TYPES.START,
	};
};
export const ColorGameActions = {
	revealAnswer,
	disableOptions,
	newGame,
	incrementGameCounter,
	endGame,
	startGame,
};
