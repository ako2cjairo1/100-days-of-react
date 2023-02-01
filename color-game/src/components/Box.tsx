import { FC } from 'react';
import styles from '../modules/ColorGame.module.css';
import { ColorProps } from '../types';

export const Box: FC<ColorProps> = ({ color, isReveal }) => {
	const { box } = styles;
	return (
		<div className={box} style={{ color, backgroundColor: color }}>
			<span>{isReveal ? color : null}</span>
		</div>
	);
};
