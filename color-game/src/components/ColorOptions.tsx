import { OptionButton } from '.';
import { ColorOptionsProp } from '../types';
import styles from '../modules/ColorGame.module.css';

export const ColorOptions = ({
	colorOptions,
	colorGuessing,
	isReveal,
	callbackFn,
}: ColorOptionsProp) => {
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
