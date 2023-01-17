import { useEffect, useReducer } from 'react';
import './App.css';
import { ColorBox } from './components/ColorBox';
import { ColorOption } from './components/ColorOption';
import { generateColorOptions } from './helper';

const CONST = {
	/* TODO: provide number of options to choose */
	OPTION_COUNT: 3,
};
type StateProps = {
	colorOptions: string[];
	correctColor: string;
	isReveal: boolean;
};

type ActionProps = {
	type: string;
	payload?: string;
};

const initialState: StateProps = {
	colorOptions: [],
	correctColor: '',
	isReveal: false,
};

const gameReducer = (state: StateProps, action: ActionProps) => {
	switch (action.type) {
		case 'NEW':
			const optionCount = CONST.OPTION_COUNT;
			const initColorOptions = generateColorOptions(optionCount);
			const correctColor = initColorOptions[Math.floor(Math.random() * optionCount)];
			return { colorOptions: initColorOptions, correctColor, isReveal: false };
		case 'REVEAL_COLOR':
			return { ...state, isReveal: true };
		default:
			return state;
	}
};

function App() {
	const [{ colorOptions, correctColor, isReveal }, dispatch] = useReducer(
		gameReducer,
		initialState
	);

	useEffect(() => dispatch({ type: 'NEW' }), []);

	const handleClickOption = () => {
		dispatch({ type: 'REVEAL_COLOR' });
		setTimeout(() => {
			dispatch({ type: 'NEW' });
		}, 2000);
	};

	return (
		<div className='App'>
			<div className='container'>
				<ColorBox color={correctColor} revealColorName={isReveal} />
				<div className='options'>
					{colorOptions.map((option, idx) => {
						return (
							<ColorOption
								key={idx}
								optionValue={option}
								enable={isReveal}
								isCorrect={isReveal ? (option === correctColor ? '✅' : '❌') : ''}
								handleClickOption={handleClickOption}
							/>
						);
					})}
				</div>
			</div>
		</div>
	);
}

export default App;
