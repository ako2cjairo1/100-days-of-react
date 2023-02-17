import { useGameContext } from '../../hooks/useGameContext';
import classNames from '../../modules/Game.module.css';
import { BoxProps } from '../../types';

export const Box = ({ boxIdx, pawn }: BoxProps) => {
	const { box, active, inactive, win } = classNames;
	const { state, handlers } = useGameContext();
	// extract states and handler from custom hook
	const { isReset, start, matched, isWaiting} = state
	const { playerMove } = handlers
	// disable button if the game has started and/or box is not available
	const isDisabled = isReset && !start ? false : start ? (start && pawn !== null) : true;
	const matchedClass = matched.includes(boxIdx) ? win : pawn === null && inactive

	return (
		<button
			className={`${box} ${isDisabled ? matchedClass : active}`}
			// disable if already selected
			disabled={isDisabled || isWaiting}
			onClick={() => playerMove({boxIdx,pawn})}>
			{pawn}
		</button>
	);
};
