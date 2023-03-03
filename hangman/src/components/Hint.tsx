import { useEffect, useState } from 'react'
import { executeAfterSomeTime, getRandom } from '../hangmanHelper'
import { HintProps } from '../types/HangMan.type'
const initState = { hint: '', emoji: '' }

export const Hint = ({ cssModule, wordToGuess, isDone }: HintProps) => {
	const [info, setInfo] = useState(initState)

	useEffect(() => {
		let timeout: NodeJS.Timer
		const { info } = wordToGuess

		if (info.includes(';')) {
			// if have multiple info, show them one-by-one every 3sec
			timeout = setInterval(() => {
				let randomHint = info.includes(';') ? getRandom(info.split(';')).trim() : info.trim()
				setInfo({ hint: randomHint, emoji: getRandom(['👉', '💡']) })
			}, 1000)
		} else {
			executeAfterSomeTime(() => setInfo({ hint: info, emoji: getRandom(['👉', '💡']) }), 1)
		}
		return () => {
			setInfo(initState)
			clearInterval(timeout)
		}
	}, [wordToGuess])

	return (
		<div className={cssModule.hint}>
			{info.hint ? (
				<p className={info.hint ? cssModule.show : ''}>
					{!isDone && <span className={cssModule.emoji}>{info.emoji}</span>}{' '}
					{info.emoji && (
						<q>
							<cite>{info.hint}</cite>
						</q>
					)}
				</p>
			) : null}
		</div>
	)
}
