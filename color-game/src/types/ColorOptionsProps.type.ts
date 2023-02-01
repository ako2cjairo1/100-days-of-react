import { CSSColorProp } from '.';

export type ColorOptionsProp = {
	colorOptions: CSSColorProp[];
	colorGuessing: CSSColorProp;
	isReveal: boolean;
	callbackFn: (answer: CSSColorProp) => void;
};
