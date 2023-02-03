import { generateColorOptions } from '../helper';
import { ActionProps, ACTION_TYPES, StateProps } from '../types';

export const initialState = {
	start: false,
	colors: [],
	colorGuessing: '',
	isReveal: false,
	gameCounter: -1,
	correctCounter: 0,
	isWin: false,
};

export const colorGameReducer = (state: StateProps, action: ActionProps) => {
	const { type, payload } = action;

	switch (type) {
		case ACTION_TYPES.NEW_GAME:
			const colors = generateColorOptions(4);
			const colorGuessing = colors[Math.floor(Math.random() * colors.length)];
			return {
				...state,
				colors,
				colorGuessing,
				start: true,
				isReveal: false,
			};
		case ACTION_TYPES.REVEAL:
			const isWin = payload === state.colorGuessing;
			const correctCounter = isWin ? state.correctCounter + 1 : state.correctCounter;
			return {
				...state,
				isWin,
				correctCounter,
				isReveal: true,
			};
		case ACTION_TYPES.INCREMENT_GAME_COUNTER:
			return {
				...state,
				gameCounter: state.gameCounter + 1,
			};
		default:
			return state;
	}
};
