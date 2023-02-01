import styles from '../modules/ColorGame.module.css';
import puff from '../assets/puff.svg';
import { OptionProps } from '../types';
import { FC, useState } from 'react';

const StatusIcon: FC<{
	isChecking: boolean;
	isReveal: boolean;
	isCorrect: boolean;
	isSelected: boolean;
}> = ({ isChecking, isCorrect, isReveal, isSelected }) => {
	const { icon } = styles;
	return (
		<>
			{isChecking && !isReveal ? (
				// loading view
				<img src={puff} />
			) : !isChecking && isReveal ? (
				isCorrect ? (
					// correct answer
					<span className={icon}>✅</span>
				) : (
					// if selected a wrong answer
					isSelected && <span className={icon}>❌</span>
				)
			) : (
				// default view
				<span className={icon} style={{ marginLeft: '20px' }}>
					⃝
				</span>
			)}
		</>
	);
};

export const OptionButton: FC<OptionProps> = ({ color, colorGuessing, isReveal, callbackFn }) => {
	const { option } = styles;
	const [isChecking, setIsChecking] = useState(false);
	const [isSelected, setIsSelected] = useState(false);
	const isCorrect = colorGuessing == color;

	const handleClick = () => {
		setIsSelected(true);
		setIsChecking(true);

		const timeout = setTimeout(() => {
			setIsChecking(false);
			clearTimeout(timeout);
			// invoke callback function
			callbackFn(color);
		}, 1000);
	};

	return (
		<button className={option} disabled={isReveal} onClick={() => handleClick()}>
			<StatusIcon
				isChecking={isChecking}
				isCorrect={isCorrect}
				isReveal={isReveal}
				isSelected={isSelected}
			/>
			<p>{color}</p>
		</button>
	);
};
