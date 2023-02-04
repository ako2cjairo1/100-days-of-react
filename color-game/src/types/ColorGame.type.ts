export enum ACTION_TYPES {
	REVEAL,
	DISABLE,
	NEW_GAME,
	INCREMENT_GAME_COUNTER,
	END,
	START,
}

export type CSSColorProp = React.CSSProperties['color'];

export type StateProps = {
	start: boolean;
	colors: CSSColorProp[];
	colorGuessing: CSSColorProp;
	isReveal: boolean;
	disableOptions: boolean;
	gameCounter: number;
	correctCounter: number;
	isWin: boolean;
};
export type ActionProps<T> = {
	type: ACTION_TYPES;
	payload?: T;
};

export type OptionButtonProps = {
	color: CSSColorProp;
	index: number;
};

export type StatusIconProps = {
	isChecking: boolean;
	isReveal: boolean;
	isCorrect: boolean;
	isSelected: boolean;
};

export type UseColorGameProps = {
	colorGameState: StateProps;
	handleReveal: (isWin: boolean) => void;
	handleNewGame: () => void;
	handleDisable: () => void;
	handleEndGame: () => void;
	handleStartGame: () => void;
};
