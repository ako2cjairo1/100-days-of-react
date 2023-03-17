import { Routes, Route } from 'react-router-dom'
import { Login, Registration } from '@/pages'

const App = () => {
	return (
		<main className="App">
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
			</Routes>
		</main>
	)
}

export default App
