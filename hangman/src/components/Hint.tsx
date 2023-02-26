import { getRandom } from '../hangmanHelper'
import { HintProps } from '../types/HangMan.type'

export const Hint = ({ cssModule, wordToGuess, isDone }: HintProps) => {
	const hint = getRandom(wordToGuess.info.trim().split(';')).trim()
	return (
		<div className={cssModule.stats}>
			<p>
				{!isDone ? 'hint: ' : ''}
				<q>
					<cite>{hint}</cite>
				</q>
			</p>
		</div>
	)
}
