import { createContext } from 'react';
import { initialValue, useTicTacToe } from '../hooks/useTicTacToe';
import { ChildrenProps, ContextProps } from '../types';

export const GameContext = createContext<ContextProps>(initialValue);

export const TicTacToeProvider = ({ children }: ChildrenProps) => {
	const {state, handlers} = useTicTacToe()	

	return (
		<GameContext.Provider value={{ state, handlers }}>
			{children}
		</GameContext.Provider>
	);
};
