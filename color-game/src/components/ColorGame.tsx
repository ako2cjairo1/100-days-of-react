import { useReducer } from 'react';
import { smiley } from '../assets';
import { ColorGameStyles as styles } from '../modules';
import { Box, ColorOptions, Emoji } from './colorgame/index';
import { colorGameReducer, initialState } from '../reducers';
import { ColorGameActions } from '../actions';
import { useColorGame } from '../hooks';

export default () => {
	const { container, stat, emoji } = styles;
	// custom hook for ColorGame
	const { colorGameState, handleReveal, startGame } = useColorGame();
	// extract states from reducer
	const { start, colors, colorGuessing, isReveal, gameCounter, correctCounter, isWin } =
		colorGameState;

	return (
		<main className={container}>
			<h1>Hex Color Quiz</h1>
			{start ? (
				// Show game board
				<>
					<div className={emoji}>
						{gameCounter <= 0 ? <img src={smiley} /> : <Emoji isWin={isWin} />}
					</div>
					<p className={stat}>
						{`You got ${correctCounter} correct guess(es) out of ${gameCounter}`}
					</p>
					<Box color={colorGuessing} isReveal={isReveal} />
					<ColorOptions
						colorOptions={colors}
						colorGuessing={colorGuessing}
						callbackFn={handleReveal}
						isReveal={isReveal}
					/>
				</>
			) : (
				// Show introduction (start view)
				<>
					<button onClick={startGame}>Start Game</button>
					<p className={stat}>Press `START GAME` to continue</p>
				</>
			)}
		</main>
	);
};
