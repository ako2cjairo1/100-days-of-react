import { useContext } from 'react';
import { GameContext } from '../contexts';

export const useGameContext = () => {
	return useContext(GameContext);
};
