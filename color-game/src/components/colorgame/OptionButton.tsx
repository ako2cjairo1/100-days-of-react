import { useState } from 'react';
import { ColorGameStyles as styles } from '../../modules';
import { OptionButtonProps } from '../../types';
import StatusIcon from './StatusIcon';

export default ({ color, colorGuessing, isReveal, callbackFn }: OptionButtonProps) => {
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
