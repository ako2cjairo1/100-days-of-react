import styles from '../modules/ColorGame.module.css';
import { CSSColorProp } from './OptionButton';

type ColorProps = {
	// restrict any other styles except for 'color' property
	color: CSSColorProp;
	isReveal: boolean;
};

export const Box = ({ color, isReveal }: ColorProps) => {
	const { box } = styles;
	return (
		<div className={box} style={{ color, backgroundColor: color }}>
			<span>{isReveal ? color : null}</span>
		</div>
	);
};
