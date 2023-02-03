import { ColorGameStyles as styles } from '../../modules';
import { BoxProps } from '../../types';

export default ({ color, isReveal }: BoxProps) => {
	const { box } = styles;
	return (
		<div className={box} style={{ color, backgroundColor: color }}>
			<span>{isReveal ? color : null}</span>
		</div>
	);
};
