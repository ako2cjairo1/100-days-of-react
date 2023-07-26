import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { store } from './services/store'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from '@/services/context'
import App from './App'
import '@/assets/modules/global.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
	<React.StrictMode>
		<Provider store={store}>
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
		</Provider>
	</React.StrictMode>
)
