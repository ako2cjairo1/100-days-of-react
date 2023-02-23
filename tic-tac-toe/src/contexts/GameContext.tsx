import { createContext } from 'react'
import { init, useTicTacToe } from '../hooks/useTicTacToe'
import { ChildrenProps, ContextProps } from '../types'

export const GameContext = createContext<ContextProps>({ state: init, handlers: {} })

export const TicTacToeProvider = ({ children }: ChildrenProps) => {
	const { state, handlers } = useTicTacToe()

	return <GameContext.Provider value={{ state, handlers }}>{children}</GameContext.Provider>
}
