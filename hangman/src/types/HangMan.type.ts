export type TLetter = {
	letter: string
	isGuessed: boolean
	isCorrect: boolean
}

export type WordDictionary = Array<{
	id: number
	word: string
	definition: string
}>

type GuessCounter = {
	wrongGuessCounter: number
}

export type DrawingProps = GuessCounter & {
	isDone: boolean
}

export type GuessingWordProps = {
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

export type WordDictType = Array<{ id: number; word: string; definition: string }>
export type JSONResponse = {
	choices?: Array<{ text: string }>
	errors?: Array<{ message: string }>
}
