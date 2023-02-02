import { FC, memo, useReducer } from 'react';
import { generateColorOptions } from '../helper';
import styles from '../modules/ColorGame.module.css';
import { CSSColorProp } from '../types';
import { Box, ColorOptions } from '.';
import giphy from '../assets/giphy.gif';
import wink from '../assets/wink.gif';
import wink2 from '../assets/wink2.gif';
import sad from '../assets/sad.gif';
import cry from '../assets/cry.gif';
import { colorGameReducer } from '../reducers/colorGameReducer';
import { ColorGameActions } from '../actions';

const initialState = {
	start: false,
	colors: [],
	colorGuessing: '',
	isReveal: false,
	gameCounter: -1,
	correctCounter: 0,
	isWin: false,
};

const Emoji: FC<{ isWin: boolean }> = memo(({ isWin }) => {
	const { emoji } = styles;
	let reactions = [wink2, wink];

	if (!isWin) {
		reactions = [sad, cry];
	}
	return <img src={reactions[Math.floor(Math.random() * 2)]} />;
});

export default () => {
	const { container, stat, emoji } = styles;
	const [{ start, colors, colorGuessing, isReveal, gameCounter, correctCounter, isWin }, dispatch] =
		useReducer(colorGameReducer, initialState);

	const startGame = () => {
		dispatch(ColorGameActions.incrementGameCounter());
		const timeout = setTimeout(
			() => {
				dispatch(ColorGameActions.newGame());
				clearTimeout(timeout);
			},
			gameCounter <= -1 ? 200 : 3000
		);
	};

	const handleReveal = (answer: CSSColorProp) => {
		dispatch(ColorGameActions.revealAnswer(answer));
		startGame();
	};

	return (
		<main className={container}>
			<h1>Hex Color Quiz</h1>
			{!start ? (
				<>
					<button onClick={startGame}>Start Game</button>
					<p className={stat}>Press `START GAME` to continue</p>
				</>
			) : (
				<>
					<div className={emoji}>
						{gameCounter <= 0 ? <img src={giphy} /> : <Emoji isWin={isWin} />}
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
			)}
		</main>
	);
};
