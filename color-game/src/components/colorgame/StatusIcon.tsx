import { ColorGameStyles as styles } from '../../modules';
import { loading } from '../../assets';
import { StatusIconProps } from '../../types';

export default ({ isChecking, isCorrect, isReveal, isSelected }: StatusIconProps) => {
	const { icon } = styles;
	return (
		<>
			{isChecking && !isReveal ? (
				// loading view
				<img src={loading} />
			) : !isChecking && isReveal ? (
				isCorrect ? (
					// correct answer
					<span className={icon}>✅</span>
				) : (
					// if selected a wrong answer
					isSelected && <span className={icon}>❌</span>
				)
			) : null }
		</>
	);
};
