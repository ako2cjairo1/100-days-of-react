import React, { useContext } from 'react';
import { GameContext } from '../contexts';
import styles from '../css/ColorBox.module.css';

type ColorProps = {
	// restrict any other styles except for 'color' property
	color: React.CSSProperties['color'];
	revealColorName?: boolean;
};

export const ColorBox = React.memo(() => {
	const { state } = useContext(GameContext);
	const { correctColor, isReveal } = state;

	return (
		<div className={styles.box} style={{ color: correctColor, backgroundColor: correctColor }}>
			{isReveal ? correctColor : null}
		</div>
	);
});
