import styles from '../css/ColorOption.module.css';

type OptionButtonProps = {
	optionValue: string;
	handleClickOption: () => void;
	enable: boolean;
	isCorrect?: string;
};

export const OptionButton = ({
	optionValue,
	handleClickOption,
	enable,
	isCorrect,
}: OptionButtonProps) => {
	return (
		<>
			<button className={styles.option} onClick={handleClickOption} disabled={enable}>
				<a style={{ fontSize: '1.5rem', marginRight: '50%' }}>{isCorrect}</a>
				{optionValue}
			</button>
		</>
	);
};
