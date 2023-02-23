import React from 'react'
import ReactDOM from 'react-dom/client'
import HangMan from './components/HangMan'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<HangMan />
	</React.StrictMode>
)
