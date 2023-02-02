import { ActionProps, ACTION_TYPES, CSSColorProp } from '../types';

const newGame = (): ActionProps => {
	return {
		type: ACTION_TYPES.NEW_GAME,
	};
};
const revealAnswer = (color: CSSColorProp): ActionProps => {
	return {
		type: ACTION_TYPES.REVEAL,
		payload: color,
	};
};
const incrementGameCounter = (): ActionProps => {
	return {
		type: ACTION_TYPES.INCREMENT_GAME_COUNTER,
	};
};
export const ColorGameActions = {
	revealAnswer,
	newGame,
	incrementGameCounter,
};
