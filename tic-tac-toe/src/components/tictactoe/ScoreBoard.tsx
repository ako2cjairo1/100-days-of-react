import { ScoreBoardProps } from '../../types'

export const ScoreBoard = ({ styles, scores, players }: ScoreBoardProps) => {
	const { scoreboard, menu, } = styles
	const { Computer, Human } = players

	return (
		<div className={scoreboard}>
			<p className={menu}>
				You <a>{Human}</a>
				<span>{scores[Human] === 0 ? '' : scores[Human]}</span>
			</p>
			{scores.draw === 0 ? null : (
				<p className={menu}>
					Tie<span>{scores.draw}</span>
				</p>
			)}
			<p className={menu}>
				🤖 <a>{Computer}</a>
				<span>{scores[Computer] === 0 ? '' : scores[Computer]}</span>
			</p>
		</div>
	)
}
