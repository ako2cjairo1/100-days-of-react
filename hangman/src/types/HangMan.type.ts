import { ReactElement } from 'react'

export type ChildrenProps = {
	children: ReactElement | null
}
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

type CssModule = {
	cssModule: CSSModuleClasses
}
export type GuessingWordProps = CssModule & {
	wordToGuess: string
	isDone: boolean
	keyboard: TLetter[]
}

export type StatusMessageProps = CssModule &
	GuessCounter & {
		isSuccessfulGuess: boolean
	}

export type KeyboardProps = Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> & {
	letters: TLetter[]
	handler: (letter: string) => void
}

export type HintProps = CssModule & {
	wordToGuess: WordDefinition
	isDone: boolean
	wrongGuessCounter: number
}

export type ErrorProps = {
	message: string
}

export type MenuProps = {
	isDone: boolean
	category: {
		category: string
		itemCount: number
	}
	initGame: () => void
	catName: string
	setCatName: (catName: string) => void
	fetchInitialGame: () => void
}

export type JSONResponse = {
	choices?: Array<{ text: string }>
	errors?: Array<{ message: string }>
}
