export type ChildrenProps = {
	children: React.ReactNode;
};

export type EnumPawns = "❌" | "⚪️";
export type TBox = EnumPawns | null;
export type TScore = { [P in EnumPawns]: number } & { draw: number };

export type TPlayers = {
  player: "❌",
  computer: "⚪️",
} | {
	player: "⚪️",
  	computer: "❌",
  };

export type ContextProps = {
	boxes: TBox[];
	currentPawn: EnumPawns;
	isReset: boolean;
	isWaiting: boolean;
	players: TPlayers;
	scores: TScore;
	start: boolean;
	matched: number[];
	playerMove: (box: BoxProps) => void;
};

export type BoardProps = Pick<ContextProps, "boxes">;

export type BoxProps = {
	boxIdx: number;
	pawn: TBox;
};
