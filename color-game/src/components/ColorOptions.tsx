import styles from '../modules/ColorGame.module.css';
import { CSSColorProp, OptionButton } from './OptionButton';

type ColorOptionsProp = {
	colorOptions: CSSColorProp[];
	colorGuessing: CSSColorProp;
	isReveal: boolean;
	callbackFn: (answer: CSSColorProp) => void;
};
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
