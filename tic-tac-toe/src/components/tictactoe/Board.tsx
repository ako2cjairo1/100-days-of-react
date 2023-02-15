import classNames from '../../modules/TicTacToe.module.css';
import { BoardProps } from '../../types';
import { Box } from './Box';

const Board = ({ boxes }: BoardProps) => {
	const { board } = classNames;

	return (
		<div className={board}>
			{boxes.map((box, idx) => (
				<Box key={idx} pawn={box} boxIdx={idx} />
			))}
		</div>
	);
};

export default Board;
