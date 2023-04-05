import { Routes, Route } from 'react-router-dom'
import { Login, Registration, Keychain } from '@/pages'
import { RotatingBackdrop } from './components'

const App = () => {
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
					path="/keychain"
					element={<Keychain />}
				/>
			</Routes>
		</main>
	)
}

export default App
