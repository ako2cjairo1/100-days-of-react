import styles from '../modules/ColorGame.module.css';
import puff from '../assets/puff.svg';
import { useState } from 'react';

export type CSSColorProp = React.CSSProperties['color'];

type OptionProps = {
	color: CSSColorProp;
	colorGuessing: CSSColorProp;
	isReveal: boolean;
	callbackFn: (answer: CSSColorProp) => void;
};
export const OptionButton = ({ color, colorGuessing, isReveal, callbackFn }: OptionProps) => {
	const { icon } = styles;
	const [isChecking, setIsChecking] = useState(false);
	const [isSelected, setIsSelected] = useState(false);
	const isCorrect = colorGuessing == color;

	const handleClick = () => {
		setIsSelected(true);
		setIsChecking(true);

		const timeout = setTimeout(() => {
			setIsChecking(false);
			clearTimeout(timeout);
			callbackFn(color);
		}, 1000);
	};

	const ResetOptionComponent = () => {
		return (
			<span className={icon} style={{ marginLeft: '20px' }}>
				⃝
			</span>
		);
	};

	return (
		<button disabled={isReveal} onClick={() => handleClick()}>
			{isChecking && !isReveal ? (
				// loading view
				<img src={puff} />
			) : !isChecking && isReveal ? (
				isCorrect ? (
					<span className={icon}>✅</span>
				) : (
					isSelected && <span className={icon}>❌</span>
				)
			) : (
				<ResetOptionComponent />
			)}
			<p>{color}</p>
		</button>
	);
};
