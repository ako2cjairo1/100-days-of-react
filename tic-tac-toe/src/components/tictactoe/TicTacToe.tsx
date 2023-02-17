import { useGameContext } from '../../hooks/useGameContext';
import classNames from '../../modules/Game.module.css';
import Board from './Board';

export default () => {
	// extract classnames from css module
	const { main, header, stats, lower, hourglass } = classNames;
	// extract states from custom hook
	const { state } = useGameContext();
	const { boxes, currentPawn, isReset, players, scores, start } = state
	const {player, computer} = players

	return (
		<main className={main}>
			<div className={header}>
				{
					!start && isReset ? <>
						<p className={stats}>Choose your pawn</p>
						<p className={`${stats} ${lower}`}>
							"<a>{currentPawn}</a>" will start first.
						</p>
					</> : <section>
						<p className={stats}>
							You <a>{player}</a>
							<span>{scores[player] === 0 ? '' : scores[player]}</span>
						</p>
						{
							scores.draw === 0 ? null : <p className={stats}>Tie<span>{scores.draw}</span>
						</p>
						}
						<p className={stats}>
							🤖 <a>{computer}</a>
							<span>{scores[computer] === 0 ? '' : scores[computer]}</span>
						</p>
					</section>
				}
			</div>
			<div style={{ height: "20px"}}>
			{start && computer === currentPawn ? <p><span className={hourglass}>⏳</span> Computer is deciding a move...</p> : null}
			</div>
			<Board boxes={boxes} />
		</main>
	);
};
