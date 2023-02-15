import { useContext } from 'react';
import { TicTacToeContext } from '../contexts';

export const useTicTacToeContext = () => {
	return useContext(TicTacToeContext);
};
