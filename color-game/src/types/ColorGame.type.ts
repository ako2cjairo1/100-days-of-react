export enum ACTION_TYPES {
	REVEAL,
	NEW_GAME,
	INCREMENT_GAME_COUNTER,
}

export type CSSColorProp = React.CSSProperties['color'];

export type StateProps = {
	start: boolean;
	colors: CSSColorProp[];
	colorGuessing: CSSColorProp;
	isReveal: boolean;
	gameCounter: number;
	correctCounter: number;
	isWin: boolean;
};
export type ActionProps = {
	type: ACTION_TYPES;
	payload?: CSSColorProp;
};

export type BoxProps = {
	// restrict any other styles except for 'color' property
	color: CSSColorProp;
	isReveal: boolean;
};

export type ColorOptionsProp = {
	colorOptions: CSSColorProp[];
	colorGuessing: CSSColorProp;
	isReveal: boolean;
	callbackFn: (answer: CSSColorProp) => void;
};

export type OptionButtonProps = {
	color: CSSColorProp;
	colorGuessing: CSSColorProp;
	isReveal: boolean;
	callbackFn: (answer: CSSColorProp) => void;
};

export type StatusIconProps = {
	isChecking: boolean;
	isReveal: boolean;
	isCorrect: boolean;
	isSelected: boolean;
};
