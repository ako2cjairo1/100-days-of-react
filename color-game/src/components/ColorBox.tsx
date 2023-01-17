import React from 'react';

type ColorProps = {
	// restrict any other styles except for 'color' property
	color: React.CSSProperties['color'];
	revealColorName?: boolean;
};

export const ColorBox = React.memo(({ color, revealColorName = false }: ColorProps) => {
	return (
		<div className='color-box' style={{ color, backgroundColor: color }}>
			{revealColorName ? color : null}
		</div>
	);
});
