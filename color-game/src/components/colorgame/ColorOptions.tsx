import { ColorOptionsProp } from '../../types';
import { ColorGameStyles as styles } from '../../modules';
import OptionButton from './OptionButton';

export default ({ colorOptions, colorGuessing, isReveal, callbackFn }: ColorOptionsProp) => {
	const { options } = styles;
	return (
		<section className={options}>
			{colorOptions.map((color) => {
				return (
					<OptionButton
						key={color}
						color={color}
						colorGuessing={colorGuessing}
						isReveal={isReveal}
						callbackFn={callbackFn}
					/>
				);
			})}
		</section>
	);
};
