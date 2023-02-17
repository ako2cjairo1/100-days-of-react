export enum ACTIONS {
    INIT_CHOOSE_PAWN,
    NEW_GAME,
    MOVE_POSITION,
    SET_MATCHED,
    UPDATE_SCORE_BOARD,
	TOGGLE_PAWN,
	SET_IS_WAITING,
}
export type PayloadTypes = { players?: TPlayers }
& { index?: number }
& { combinations?: number[] }
& { winner?: EnumPawns | "draw" }
& { pawn?: EnumPawns }
& { isWaiting?: boolean };



export type ActionProps<T> = {
	type: ACTIONS;
	payload: T;
};

export type EnumPawns = "❌" | "⚪️";
export type TBox = EnumPawns | null;
export type TScore = { [P in EnumPawns]: number } & { draw: number };

export type StateProps = {
	boxes: TBox[];
	startPawn: EnumPawns;
	currentPawn: EnumPawns;
	isWaiting: boolean;
	players: TPlayers;
	scores: TScore;
	start: boolean;
	matched: number[];
};

export type TPlayers = {
	player: "❌",
	computer: "⚪️",
} | {
	player: "⚪️",
	computer: "❌",
};

export type ChildrenProps = {
	children: React.ReactNode;
};

export type HandlerProps = {playerMove: (box: BoxProps) => void;}

export type BoardProps = Pick<StateProps, "boxes">;

export type BoxProps = {
	boxIdx: number;
	pawn: TBox;
};

export type ContextProps = {
	state: StateProps & { isReset: boolean };
	handlers: HandlerProps;
}
