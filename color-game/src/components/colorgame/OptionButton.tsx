import { useState } from 'react';
import { useColorGameContext } from '../../contexts/ColorGameContext';
import { ColorGameStyles as styles } from '../../modules';
import { isMatch } from '../../reducers';
import { OptionButtonProps } from '../../types';
import StatusIcon from './StatusIcon';

export default ({ color, index }: OptionButtonProps) => {
	const { option } = styles;
	const [isChecking, setIsChecking] = useState(false);
	const [isSelected, setIsSelected] = useState(false);

	const { colorGameState, handleReveal, handleDisable } = useColorGameContext();
	const { colorGuessing, isReveal, disableOptions } = colorGameState;
	let isCorrect = isMatch(color, colorGuessing);

	const handleClick = () => {
		// to prevent action on re-selecting the button
		if (!isSelected) {
			setIsSelected(true);
			setIsChecking(true);
			// disbale all option buttons when user have selected an answer
			handleDisable();

			const timeout = setTimeout(() => {
				setIsChecking(false);
				clearTimeout(timeout);
				// invoke callback function
				handleReveal(isCorrect);
			}, 1000);
		}
	};

	return (
		<button
			className={option}
			style={{ animationDelay: `${index * 0.1}s` }}
			// disable the option if not selected
			disabled={disableOptions && !isSelected}
			onClick={() => handleClick()}>
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
