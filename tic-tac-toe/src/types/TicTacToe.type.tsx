export const GAME_ACTION = {
	InitializeGame: 'Initialize and assign pawns',
	NewGame: 'New Game',
	MovePosition: 'Move To Position',
	SetWinningMatch: 'Set Winning Combination',
	UpdateScoreBoard: 'Update Scoreboard',
	ToggleCurrentPawn: 'Toggle Current Pawn',
	Waiting: 'WAITING',
} as const

export type ActionProps =
	| {
			type: typeof GAME_ACTION.InitializeGame
			players: TPlayers
	  }
	| {
			type: typeof GAME_ACTION.NewGame
	  }
	| {
			type: typeof GAME_ACTION.MovePosition
			index: number
	  }
	| {
			type: typeof GAME_ACTION.SetWinningMatch
			combinations: number[]
	  }
	| {
			type: typeof GAME_ACTION.UpdateScoreBoard
			winner: keyof TScore
	  }
	| {
			type: typeof GAME_ACTION.ToggleCurrentPawn
	  }
	| {
			type: typeof GAME_ACTION.Waiting
			isWaiting: boolean
	  }

export const PAWN = {
	'❌': '❌',
	'⚪️': '⚪️',
} as const

export type TPawn = (typeof PAWN)[keyof typeof PAWN]

export const PLAYER = {
	Human: 'Human',
	Computer: 'Computer',
} as const

export const GAME_STATUS = {
	AssignPawn: 'Assign Pawns',
	Playing: 'Playing',
	Waiting: 'Waiting',
	Tallying: 'Tally Score',
} as const

export type TGameStatus = (typeof GAME_STATUS)[keyof typeof GAME_STATUS]

export type TBox = TPawn | null
export type TScore = {
	[P in TPawn]: number
} & { draw: number }

export type StateProps = {
	boxes: TBox[]
	startPawn: TPawn
	currentPawn: TPawn
	gameStatus: TGameStatus
	players: TPlayers
	scores: TScore
	winningMatch: number[]
}

export type TPlayers =
	| {
			[PLAYER.Human]: '❌'
			[PLAYER.Computer]: '⚪️'
	  }
	| {
			[PLAYER.Human]: '⚪️'
			[PLAYER.Computer]: '❌'
	  }

export type ChildrenProps = {
	children: React.ReactNode
}

export type BoardProps = Pick<StateProps, 'boxes'>

export type MenuProps = {
	styles: CSSModuleClasses
	state: Omit<StateProps, 'startPawn'>
}

export type ChoosePawnProps = {
	styles: CSSModuleClasses
	currentPawn: TPawn
}

export type ScoreBoardProps = {
	styles: CSSModuleClasses
	scores: TScore
	players: TPlayers
}

export type StatusProps = {
	styles: CSSModuleClasses
	gameStatus: TGameStatus
	currentPawn: TPawn
	players: TPlayers
}

export type BoxProps = {
	idx: number
	pawn: TBox
}

export type ContextProps = {
	state: Omit<StateProps, 'startPawn'>
	handlers: {
		[key: string]: (...args: any[]) => any
	}
}
