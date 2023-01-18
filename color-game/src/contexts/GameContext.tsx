import React, { createContext, useReducer } from 'react';
import { gameReducer } from '../reducers';
import { ActionProps, ColorProps } from '../types';

const initialState: ColorProps = {
	colorOptions: [],
	correctColor: '',
	isReveal: false,
};

type ContextProp = {
	state: ColorProps;
	dispatch: React.Dispatch<ActionProps>;
};

type ProviderProps = {
	children: React.ReactNode;
};

export const GameContext = createContext<ContextProp>({
	state: initialState,
	dispatch: () => null,
});

export const GameProvider = ({ children }: ProviderProps) => {
	const [state, dispatch] = useReducer(gameReducer, initialState);

	return <GameContext.Provider value={{ state, dispatch }}>{children}</GameContext.Provider>;
};
