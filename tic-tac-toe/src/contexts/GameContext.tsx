import { createContext } from 'react'
import { initialState, useTicTacToe } from '../hooks/useTicTacToe'
import { ChildrenProps, ContextProps } from '../types'

export const GameContext = createContext<ContextProps>({ state: initialState, handlers: {} })

export const TicTacToeProvider = ({ children }: ChildrenProps) => {
	const { state, handlers } = useTicTacToe()

	return <GameContext.Provider value={{ state, handlers }}>{children}</GameContext.Provider>
}
