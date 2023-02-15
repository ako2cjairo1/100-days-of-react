import React from 'react';
import ReactDOM from 'react-dom/client';
import { ColorGame } from './components';
import { ColorGameContext } from './contexts/ColorGameContext';
import './main.css';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		{/* <div className='background'>
			<div style={{ fill: '#8f44fd' }}>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 317.5 353.7'>
					<path d='M291.8 55.3c30.4 39.9 30.7 102 17 160.4-13.8 58.3-41.6 112.9-84 130.9s-99.3-.6-137-30C50.2 287.1 32 246.9 17 200.5 2.1 154.1-9.6 101.4 11.5 63.6 32.6 25.8 86.6 2.8 143.8.2c57.2-2.6 117.6 15.2 148 55.1z'></path>
				</svg>
			</div>
			<div style={{ fill: '#61a5ff' }}>
				<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 371.5 297.7'>
					<path d='M286.9 54.2c42.7 34.9 89.4 85.3 84.2 130.4-5.2 45.1-62.1 84.7-118 102.3S142.3 300 94.8 278C47.2 256 6.9 216.6.8 173.9S22.7 85.2 56 52.4C89.4 19.6 127.9.1 166.6 0s77.6 19.2 120.3 54.2z'></path>
				</svg>
			</div>
		</div>
		<div className='overlay'></div> */}

		{/* Wrap the components that will use the ColorGame context */}
		<ColorGameContext colorCount={4}>
			<ColorGame />
		</ColorGameContext>
	</React.StrictMode>
);
