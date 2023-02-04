import { loading, smiley } from '../assets';
import { ColorGameStyles as styles } from '../modules';
import { Box, ColorOptions, Emoji } from './colorgame/index';
import { useColorGameContext } from '../contexts/ColorGameContext';

export default () => {
	const { container, stat, emoji, highlight, loadgame, close } = styles;
	// custom hook for ColorGame
	const { colorGameState, handleStartGame, handleEndGame } = useColorGameContext();
	// extract individual states from context using provided custom hook
	const { correctCounter, gameCounter, isWin, start, isReveal } = colorGameState;

	return (
		<main className={container}>
			<h1>Hex Color Quiz</h1>
			{start ? (
				// Show game board
				<>
					<div className={emoji}>
						<div>
							{start && (
								<button className={close} onClick={handleEndGame}>
									end
								</button>
							)}
							{gameCounter <= 0 ? <img src={smiley} /> : <Emoji isWin={isWin} />}
							<p className={stat}>
								{isReveal && <img src={loading} />}
								{isReveal ? (
									<a>
										Loading game <span className={highlight}>#{gameCounter + 1}</span>
									</a>
								) : gameCounter > 0 ? (
									<a>
										You got <span className={highlight}>{correctCounter}</span> correct guess(es)
										out of <span className={highlight}>{gameCounter}</span>
									</a>
								) : (
									''
								)}
							</p>
						</div>
						<Box />
					</div>
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
