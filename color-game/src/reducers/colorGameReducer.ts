import { generateColorOptions } from '../helper';
import { ActionProps, ColorProps } from '../types';

const CONST = {
	/* TODO: provide number of options to choose */
	OPTION_COUNT: 3,
	NEW_GAME: 'NEW',
	REVEAL_COLOR: 'REVEAL_COLOR',
};

// create action creators for gameReducer functionality
const setNewGame = (isReveal: boolean) => {
	return {
		type: CONST.NEW_GAME,
		payload: isReveal,
	};
};

const setRevealColor = (isReveal: boolean) => {
	return {
		type: CONST.REVEAL_COLOR,
		payload: isReveal,
	};
};

// main reducer
export const gameReducer = (state: ColorProps, action: ActionProps) => {
	switch (action.type) {
		case CONST.NEW_GAME:
			const optionCount = CONST.OPTION_COUNT;
			const initColorOptions = generateColorOptions(optionCount);
			const correctColor = initColorOptions[Math.floor(Math.random() * optionCount)];
			return {
				...state,
				colorOptions: initColorOptions,
				correctColor,
				isReveal: action.payload,
			};
		case CONST.REVEAL_COLOR:
			return { ...state, isReveal: action.payload };
		default:
			return state;
	}
};

export const gameAction = { setNewGame, setRevealColor };
