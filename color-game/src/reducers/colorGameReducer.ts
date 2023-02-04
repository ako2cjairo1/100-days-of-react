import { decrypt, encrypt, generateColorOptions } from '../colorGameHelper';
import { ActionProps, ACTION_TYPES, CSSColorProp, StateProps } from '../types';

export const initialState: StateProps = {
	start: false,
	colors: [],
	colorGuessing: '',
	isReveal: false,
	disableOptions: false,
	gameCounter: -1,
	correctCounter: 0,
	isWin: false,
};

export const isMatch = (answer: CSSColorProp, correctColor: CSSColorProp) => {
	const decryptedCorrectColor = decrypt(correctColor as string);
	return answer === decryptedCorrectColor;
};

export const colorGameReducer = (state: StateProps, action: ActionProps<number | boolean>) => {
	const { type, payload } = action;

	switch (type) {
		case ACTION_TYPES.NEW_GAME:
			const colorCount = payload as number;
			const colors = generateColorOptions(colorCount);
			const colorGuessing = encrypt(colors[Math.floor(Math.random() * colors.length)]);
			return {
				...state,
				colors,
				colorGuessing,
				isReveal: false,
				disableOptions: false,
			};
		case ACTION_TYPES.REVEAL:
			const isWin = payload as boolean;
			// increment the correct stat if isWin
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
		case ACTION_TYPES.DISABLE:
			return {
				...state,
				disableOptions: true,
			};
		case ACTION_TYPES.END:
			return {
				...initialState,
				start: false,
			};
		case ACTION_TYPES.START:
			return {
				...initialState,
				start: true,
			};
		default:
			return state;
	}
};
