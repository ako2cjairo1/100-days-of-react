import { useColorGameContext } from '../../contexts/ColorGameContext';
import { ColorGameStyles as styles } from '../../modules';
import OptionButton from './OptionButton';

export default () => {
	const { options } = styles;
	const { colorGameState } = useColorGameContext();
	const { colors } = colorGameState;

	return (
		<section className={options}>
			{colors.map((color, index) => {
				return <OptionButton key={color} color={color} index={index} />;
			})}
		</section>
	);
};
