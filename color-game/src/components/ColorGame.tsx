import { useState } from 'react';
import { generateColorOptions } from '../helper';
import styles from '../modules/ColorGame.module.css';
import { Box } from './Box';
import { ColorOptions } from './ColorOptions';
import { CSSColorProp } from './OptionButton';

let colors = generateColorOptions(4);
let colorGuessing = colors[Math.floor(Math.random() * colors.length)];
let gameCounter = 0;
let correctAns = 0;

export default () => {
	const { container, stat } = styles;
	const [isReveal, setIsReveal] = useState(false);

	const handleReveal = (answer: CSSColorProp) => {
		// reveal the correct answer
		setIsReveal(true);

		const timeout = setTimeout(() => {
			// Update scoreboard
			gameCounter++;
			if (answer == colorGuessing) {
				correctAns++;
			}
			// reset to new game
			setIsReveal(false);
			colors = generateColorOptions(4);
			colorGuessing = colors[Math.floor(Math.random() * colors.length)];
			clearTimeout(timeout);
		}, 3000);
	};

	return (
		<main className={container}>
			<h1 style={{ color: 'white' }}>Hex Color Quiz</h1>
			<Box color={colorGuessing} isReveal={isReveal} />
			<p className={stat}>
				You got {correctAns} correct guess(es) out of {gameCounter}
			</p>
			<ColorOptions
				colorOptions={colors}
				colorGuessing={colorGuessing}
				callbackFn={handleReveal}
				isReveal={isReveal}
			/>
		</main>
	);
};
