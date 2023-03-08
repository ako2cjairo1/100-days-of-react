import { ScoreBoardProps } from '../../types'

export const ScoreBoard = ({ styles, scores, players }: ScoreBoardProps) => {
	const { scoreboard, menu, separator } = styles
	const { Computer, Human } = players

	return (
		<div className={scoreboard}>
			<p className={menu}>
				You <a>{Human}</a>
				<span>{scores[Human] === 0 ? '' : scores[Human]}</span>
			</p>
			{scores.draw === 0 ? <div className={separator}></div> : (
				<>
					<div className={separator}></div>
					<p className={menu}>
						Tie<span>{scores.draw}</span>
					</p>
					<div className={separator}></div>
				</>
			)}
			<p className={menu}>
				🤖 <a>{Computer}</a>
				<span>{scores[Computer] === 0 ? '' : scores[Computer]}</span>
			</p>
		</div>
	)
}
