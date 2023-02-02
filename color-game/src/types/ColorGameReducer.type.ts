import { CSSColorProp } from './BoxProps.type';

export enum ACTION_TYPES {
	REVEAL,
	NEW_GAME,
	INCREMENT_GAME_COUNTER,
}
type BaseActionProps = {
	type: ACTION_TYPES;
};

type RevealActionProps = {
	type: ACTION_TYPES;
	payload: CSSColorProp;
};

export type ActionProps = BaseActionProps | RevealActionProps;

export type StateProps = {
	start: boolean;
	colors: CSSColorProp[];
	colorGuessing: CSSColorProp;
	isReveal: boolean;
	gameCounter: number;
	correctCounter: number;
	isWin: boolean;
};
