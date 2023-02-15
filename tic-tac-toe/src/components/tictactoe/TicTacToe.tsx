import { useTicTacToeContext } from '../../hooks/useTicTacToeContext';
import classNames from '../../modules/TicTacToe.module.css';
import Board from './Board';

export default () => {
	// extract classnames from css module
	const { main, header } = classNames;
	// extract states from custom hook
	const { boxes, currentPawn, isReset, players, scores, start } = useTicTacToeContext();
	const {player, computer} = players

	return (
		<main className={main}>
			<div className={header}>
				{
					!start && isReset ? <section>
						<p>Choose your pawn</p>
						<p>
							( <a>{currentPawn}</a> starts first )
						</p>
					</section> : <section>
						<p>
							Player [ <a>{player}</a> ]
							<span>{scores[player]}</span>
						</p>
						<p>
							Tie
							<span>{scores.draw}</span>
						</p>
						<p>
							Computer [ <a>{computer}</a> ]
							<span>{scores[computer]}</span>
						</p>
					</section>
				}
			</div>

			<Board boxes={boxes} />
		</main>
	);
};
