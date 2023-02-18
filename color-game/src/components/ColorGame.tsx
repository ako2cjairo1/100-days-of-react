import { ColorGameStyles as styles } from '../modules';
import { Box, ColorOptions, Status } from './colorgame/index';
import { useColorGameContext } from '../contexts/ColorGameContext';

export default () => {
	const { container, header, highlight, loadgame } = styles;
	// custom hook for ColorGame
	const { colorGameState, handleStartGame } = useColorGameContext();

	return (
		<main className={container}>
			<h1>Hex Color Quiz</h1>
			{colorGameState.start ? (
				// Show game board
				<>
					<section className={header}>
						<Status/>
						<Box />
					</section>
					<ColorOptions />
				</>
			) : (
				// Show introduction (start view)
				<>
					<button onClick={handleStartGame}>Start Game</button>
					<p className={loadgame}>
						Press `<span className={highlight}>START GAME</span>` to continue
					</p>
				</>
			)}
		</main>
	);
};
