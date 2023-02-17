import React from 'react';
import ReactDOM from 'react-dom/client';
import { TicTacToe } from './components/tictactoe';
import { TicTacToeProvider } from './contexts/GameContext';

import './main.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<TicTacToeProvider>
			<TicTacToe />
		</TicTacToeProvider>
	</React.StrictMode>
);
