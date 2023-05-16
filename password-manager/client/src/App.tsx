import { Routes, Route } from 'react-router-dom'
import { Login, Registration, Vault } from '@/pages'
import { ErrorHandler, RotatingBackdrop } from './components'

function App() {
	return (
		<main className="App">
			<RotatingBackdrop />
			<Routes>
				<Route
					path="/"
					element={<Login />}
				/>
				<Route
					path="/login"
					element={<Login />}
				/>
				<Route
					path="/registration"
					element={<Registration />}
				/>
				<Route
					path="/vault"
					element={<Vault />}
				/>
				<Route
					path="/error"
					element={<ErrorHandler />}
				/>
			</Routes>
		</main>
	)
}

export default App
