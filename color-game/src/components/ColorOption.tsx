type ColorOptionProps = {
	optionValue: string;
	handleClickOption: () => void;
	enable: boolean;
	isCorrect?: string;
};

export const ColorOption = ({
	optionValue,
	handleClickOption,
	enable,
	isCorrect,
}: ColorOptionProps) => {
	return (
		<button onClick={handleClickOption} disabled={enable}>
			{isCorrect} <code>{optionValue}</code>
		</button>
	);
};
