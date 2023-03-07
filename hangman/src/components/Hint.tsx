import { useEffect, useState } from 'react'
import { executeAfterSomeTime, getRandom } from '../hangmanHelper'
import { HintProps } from '../types/HangMan.type'
const initState = { hint: '', emoji: '' }

export const Hint = ({ cssModule, wordToGuess, isDone }: HintProps) => {
	const [hintInfo, setHintInfo] = useState(initState)
	const { info } = wordToGuess
	let timeout: NodeJS.Timer

	const getUpdatedHint = () => {
		const randomHint = info.includes(';') ? getRandom(info.split(';')).trim() : info.trim()
		setHintInfo({ hint: randomHint, emoji: getRandom(['👉', '💡']) })
	}

	useEffect(() => {
		getUpdatedHint()

		if (info.includes(';')) {
			// if have multiple hints, show them one-by-one every 5sec
			timeout = executeAfterSomeTime(
				() => {
					setHintInfo(initState)
					executeAfterSomeTime(() => getUpdatedHint(), 5)
				},
				5,
				false
			)
		} else {
			setHintInfo(initState)
			executeAfterSomeTime(() => getUpdatedHint(), 5)
		}

		if (isDone) clearInterval(timeout)

		return () => clearInterval(timeout)
	}, [info])

	return (
		<div className={cssModule.hint}>
			{hintInfo.hint ? (
				<p className={hintInfo.hint ? cssModule.show : ''}>
					{!isDone && <span className={cssModule.emoji}>{hintInfo.emoji}</span>}{' '}
					{hintInfo.emoji && (
						<q>
							<cite>{hintInfo.hint}</cite>
						</q>
					)}
				</p>
			) : null}
		</div>
	)
}
