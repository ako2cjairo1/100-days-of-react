import { CSSColorProp } from '.';

export type OptionProps = {
	color: CSSColorProp;
	colorGuessing: CSSColorProp;
	isReveal: boolean;
	callbackFn: (answer: CSSColorProp) => void;
};
