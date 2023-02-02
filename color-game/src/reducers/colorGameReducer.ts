import { generateColorOptions } from '../helper';
import { ActionProps, ACTION_TYPES, StateProps } from '../types';

export const colorGameReducer = (state: StateProps, action: ActionProps) => {
	switch (action.type) {
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
			if ('payload' in action) {
				const isWin = action.payload == state.colorGuessing;
				console.log(isWin);
				const correctCounter = isWin ? state.correctCounter + 1 : state.correctCounter;
				return {
					...state,
					isWin,
					correctCounter,
					isReveal: true,
				};
			}
			return state;
		case ACTION_TYPES.INCREMENT_GAME_COUNTER:
			return {
				...state,
				gameCounter: state.gameCounter + 1,
			};
		default:
			return state;
	}
};
