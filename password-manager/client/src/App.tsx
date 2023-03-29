import { Routes, Route } from 'react-router-dom'
import { Login, Registration, Vault } from '@/pages'
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
					path="/secure-vault"
					element={<Vault />}
				/>
			</Routes>
		</main>
	)
}

export default App
