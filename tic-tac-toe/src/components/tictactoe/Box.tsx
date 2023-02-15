import { useTicTacToeContext } from '../../hooks/useTicTacToeContext';
import classNames from '../../modules/TicTacToe.module.css';
import { BoxProps } from '../../types';

export const Box = ({ boxIdx, pawn }: BoxProps) => {
	const { box, active, inactive, win } = classNames;
	const { playerMove, isReset, start, matched } = useTicTacToeContext();
	const isDisabled = isReset && !start ? false : start ? (start && pawn !== null) : true;
	const matchedClass = matched.includes(boxIdx) ? win : pawn === null && inactive

	return (
		<button
			className={`${box} ${isDisabled ? matchedClass : active}`}
			// disable if already selected
			disabled={isDisabled}
			onClick={() => playerMove({boxIdx,pawn})}>
			{pawn}
		</button>
	);
};
