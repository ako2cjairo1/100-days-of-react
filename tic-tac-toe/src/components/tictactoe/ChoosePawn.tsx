import { ChoosePawnProps } from '../../types'

export const ChoosePawn = ({ styles, currentPawn }: ChoosePawnProps) => {
	const { menu, lower } = styles

	return (
		<>
			<p className={menu}>Choose your pawn</p>
			<p className={`$.menu} ${lower}`}>
				<q>
					<a>{currentPawn}</a>
				</q>{' '}
				will start first.
			</p>
		</>
	)
}
