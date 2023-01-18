import './App.css';
import { ColorBox, Options } from './components';
import { GameProvider } from './contexts';

function App() {
	return (
		<div className='App'>
			<div className='container'>
				<GameProvider>
					<ColorBox />
					<Options />
				</GameProvider>
			</div>
		</div>
	);
}

export default App;
