import { createContext, useContext } from 'react';
import { useColorGame } from '../hooks';
import { initialState } from '../reducers';
import { ReactChildrenProp, UseColorGameProps } from '../types';

const voidFn = () => {};
// create color game context using initial state used on reducer func.
const GameContext = createContext<UseColorGameProps>({
	colorGameState: initialState,
	handleReveal: voidFn,
	handleDisable: voidFn,
	handleEndGame: voidFn,
	handleStartGame: voidFn,
	handleNewGame: voidFn,
});

// Context provided using custom hook (useReducer)
export const ColorGameContext = ({ children, colorCount }: ReactChildrenProp) => {
	// use custom hook that utilizes useReducer hook
	const colorGameState = useColorGame(colorCount);

	return (
		<GameContext.Provider
			//spread individual states and handlers to be used by children
			value={{ ...colorGameState }}>
			{children}
		</GameContext.Provider>
	);
};

// create custom hook for children components to utilize states,callback func from context
export const useColorGameContext = () => {
	return useContext(GameContext);
};
