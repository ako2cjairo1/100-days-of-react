export type TLetter = {
	letter: string
	isGuessed: boolean
	isCorrect: boolean
}

export type WordDefinition = {
	id: number
	word: string
	info: string
}

type GuessCounter = {
	wrongGuessCounter: number
}

export type DrawingProps = GuessCounter & {
	isDone: boolean
}

export type GuessingWordProps = {
	cssModule: CSSModuleClasses
	wordToGuess: string
	isDone: boolean
	letters: TLetter[]
}

export type StatusMessageProps = GuessCounter & {
	isSuccessfulGuess: boolean
}

export type KeyboardProps = Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> & {
	letters: TLetter[]
	handler: (letter: string) => void
}

export type HintProps = {
	cssModule: CSSModuleClasses
	wordToGuess: WordDefinition
	isDone: boolean
	wrongGuessCounter: number
}

export type JSONResponse = {
	choices?: Array<{ text: string }>
	errors?: Array<{ message: string }>
}
