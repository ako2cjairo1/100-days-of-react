import { FC, memo, useState } from 'react';
import { generateColorOptions } from '../helper';
import styles from '../modules/ColorGame.module.css';
import { CSSColorProp } from '../types';
import { Box, ColorOptions } from '.';
import giphy from '../assets/giphy.gif';
import wink from '../assets/wink.gif';
import wink2 from '../assets/wink2.gif';
import sad from '../assets/sad.gif';
import cry from '../assets/cry.gif';

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
	const [start, setStart] = useState(false);
	const [colors, setColors] = useState<CSSColorProp[]>([]);
	const [colorGuessing, setColorGuessing] = useState<CSSColorProp>();
	const [isReveal, setIsReveal] = useState(false);
	const [gameCounter, setGameCounter] = useState(-1);
	const [correctCounter, setCorrectCounter] = useState(0);
	const [isWin, setIsWin] = useState(false);

	const startGame = () => {
		// Update scoreboard
		setGameCounter((prev) => prev + 1);

		const timeout = setTimeout(
			() => {
				setStart(true);
				// reset to new game
				setIsReveal(false);
				const newSetOfColors = generateColorOptions(4);
				// update states of new set of colors
				setColors(newSetOfColors);
				setColorGuessing(newSetOfColors[Math.floor(Math.random() * newSetOfColors.length)]);
				clearTimeout(timeout);
			},
			gameCounter <= -1 ? 200 : 3000
		);
	};

	const handleReveal = (answer: CSSColorProp) => {
		if (answer == colorGuessing) {
			setCorrectCounter((prev) => prev + 1);
			setIsWin(true);
		} else {
			setIsWin(false);
		}
		// reveal the correct answer
		setIsReveal(true);
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
