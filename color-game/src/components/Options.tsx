import { useContext, useEffect } from 'react';
import { GameContext } from '../contexts';
import { gameAction } from '../reducers';
import { OptionButton } from './';
import styles from '../css/ColorOption.module.css';

export const Options = () => {
	const { state, dispatch } = useContext(GameContext);
	const { colorOptions, correctColor, isReveal } = state;

	useEffect(() => dispatch(gameAction.setNewGame(false)), []);

	const handleClickOption = () => {
		dispatch(gameAction.setRevealColor(true));
		setTimeout(() => {
			dispatch(gameAction.setNewGame(false));
		}, 2000);
	};

	return (
		<div className={styles.options}>
			{colorOptions.map((option, idx) => {
				return (
					<OptionButton
						key={idx}
						optionValue={option}
						enable={isReveal}
						isCorrect={isReveal ? (option === correctColor ? '🟢' : '🔴') : '⚪️'}
						handleClickOption={handleClickOption}
					/>
				);
			})}
		</div>
	);
};
