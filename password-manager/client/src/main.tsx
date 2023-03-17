import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import App from './App'
import { AuthProvider } from '@/services/context'
import '@/assets/modules/global.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<BrowserRouter>
			<AuthProvider>
				<Routes>
					<Route
						path="/*"
						element={<App />}
					/>
				</Routes>
			</AuthProvider>
		</BrowserRouter>
	</React.StrictMode>
)
