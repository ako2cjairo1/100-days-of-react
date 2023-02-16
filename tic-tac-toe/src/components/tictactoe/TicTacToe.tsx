import { useTicTacToeContext } from '../../hooks/useTicTacToeContext';
import classNames from '../../modules/TicTacToe.module.css';
import Board from './Board';

export default () => {
	// extract classnames from css module
	const { main, header, stats, lower, hourglass } = classNames;
	// extract states from custom hook
	const { boxes, currentPawn, isReset, players, scores, start } = useTicTacToeContext();
	const {player, computer} = players

	return (
		<main className={main}>
			<div className={header}>
				{
					!start && isReset ? <>
						<p className={stats}>Choose your pawn</p>
						<p className={`${stats} ${lower}`}>
							( "<a>{currentPawn}</a>" will start first )
						</p>
					</> : <section>
						<p className={stats}>
							You (<a>{player}</a>)
							<span>{scores[player] === 0 ? '' : scores[player]}</span>
						</p>
						{
							scores.draw === 0 ? null : <p className={stats}>Tie<span>{scores.draw}</span>
						</p>
						}
						<p className={stats}>
							🤖 (<a>{computer}</a>)
							<span>{scores[computer] === 0 ? '' : scores[computer]}</span>
						</p>
					</section>
				}
			</div>
			{start && computer === currentPawn ? <p><span className={hourglass}>⏳</span> Computer is deciding a move...</p> : null}
			<Board boxes={boxes} />
		</main>
	);
};
