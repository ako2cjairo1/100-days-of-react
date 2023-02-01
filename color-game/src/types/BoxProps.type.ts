export type CSSColorProp = React.CSSProperties['color'];

export type ColorProps = {
	// restrict any other styles except for 'color' property
	color: CSSColorProp;
	isReveal: boolean;
};
