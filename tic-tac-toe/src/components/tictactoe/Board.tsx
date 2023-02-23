import { Box } from '.'
import classNames from '../../modules/Game.module.css'
import { StateProps } from '../../types'

export const Board = ({ boxes }: Pick<StateProps, 'boxes'>) => {
	const { board } = classNames

	return (
		<div className={board}>
			{boxes.map((pawn, idx) => (
				<Box
					key={idx}
					pawn={pawn}
					idx={idx}
				/>
			))}
		</div>
	)
}
