export type TLetter = {
	letter: string
	isGuessed: boolean
	isCorrect: boolean
}

export type DrawingProps = {
	wrongGuessCount: number
	isHang: boolean
}

export type GuessingWordProps = {
	word: string
	isDone: boolean
	guessedLetters: TLetter[]
}

export type KeyboardProps = Pick<React.ButtonHTMLAttributes<HTMLButtonElement>, 'disabled'> & {
	letters: TLetter[]
	handler: (letter: string) => void
}
