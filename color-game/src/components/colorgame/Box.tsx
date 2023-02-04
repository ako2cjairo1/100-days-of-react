import { decrypt } from '../../colorGameHelper';
import { useColorGameContext } from '../../contexts/ColorGameContext';
import { ColorGameStyles as styles } from '../../modules';

export default () => {
	const { box } = styles;
	// get color from context
	const { colorGameState } = useColorGameContext();
	// extract the states required
	const { colorGuessing, isReveal } = colorGameState;
	// decrypt the hex color value
	const guessingColor = decrypt(colorGuessing as string);

	return (
		<div
			className={box}
			style={{
				color: guessingColor,
				backgroundColor: guessingColor,
				boxShadow: `0 8px 32px 0 ${guessingColor}`,
			}}>
			<span>{isReveal ? guessingColor : '???'}</span>
		</div>
	);
};
