import { ChangeEvent, FormEvent, useEffect, useRef, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthProvider'
import { TCredentials, TStatus } from '@/types/PasswordManager.type'
import styles from '../modules/Login.module.css'
import { Socials } from './Socials'
import { loginInitState } from '../constants/LOGIN'

export const Login = () => {
	const { container, background, shape } = styles
	const { CREDENTIAL, STATUS } = loginInitState

	const { auth, setAuth } = useContext(AuthContext)

	const [credentials, setCredentials] = useState<TCredentials>(CREDENTIAL)
	const [loginStatus, setLoginStatus] = useState<TStatus>(STATUS)
	const [submit, setSubmit] = useState(false)
	const userRef = useRef<HTMLInputElement>(null)
	const errRef = useRef<HTMLInputElement>(null)

	useEffect(() => {
		userRef.current?.focus()
	}, [])

	useEffect(() => {
		setLoginStatus(prev => ({ ...prev, errMsg: '' }))
	}, [credentials])

	const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
		const { id, value } = e.target
		setCredentials(prev => ({ ...prev, [id]: value }))
	}
	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		setSubmit(true)
		const timeout = setTimeout(() => {
			try {
				// TODO: fetch access token to custom authentication backend api
				// throw new Error('test error!')
				setAuth({ ...credentials, accessToken: '' })
				setLoginStatus({ success: true, errMsg: '' })
				setCredentials(CREDENTIAL)

				setSubmit(false)
			} catch (error) {
				setSubmit(false)
				setLoginStatus({ success: false, errMsg: `${error}` })
				if (!loginStatus.success || loginStatus.errMsg) userRef.current?.focus()
			}

			clearTimeout(timeout)
		}, 3000)
	}

	return (
		<>
			{loginStatus.success ? (
				<section className={container}>
					<h1>
						You are logged in! <i className="fa fa-check" />
					</h1>
					<p>
						<a href="#">Go to keychain</a>
					</p>
				</section>
			) : (
				<section>
					<div className={background}>
						<div className={shape}></div>
						<div className={shape}></div>
					</div>
					<div className={container}>
						<form onSubmit={handleSubmit}>
							<header>
								<h1>Log in</h1>
								{loginStatus.errMsg ? (
									<p
										className={`center error`}
										ref={errRef}
										aria-live="assertive"
									>
										<i className="fa fa-exclamation-triangle" />
										{loginStatus.errMsg}
									</p>
								) : (
									<p className="center">Enter your credentials</p>
								)}
							</header>

							<input
								className={loginStatus.errMsg && 'invalid'}
								id="username"
								type="text"
								placeholder="Email"
								ref={userRef}
								autoComplete="off"
								onChange={handleInput}
								value={credentials.username}
								required
							/>

							<input
								className={loginStatus.errMsg && 'invalid'}
								id="password"
								type="password"
								placeholder="Password"
								onChange={handleInput}
								value={credentials.password}
								required
							/>
							<p className="small">
								Forgot master password?<a href="#">Reset</a>
							</p>

							<button
								disabled={!(credentials.username.length && credentials.password.length)}
								className="submit"
								type="submit"
							>
								{submit ? (
									<div
										className="spinner"
										style={{ opacity: 1 }}
									/>
								) : (
									<>
										<i className="fa fa-key" /> Login
									</>
								)}
							</button>
						</form>
						<p className="small">
							Don't have an account?<a href="#">Register</a>
						</p>
						<Socials />
					</div>
				</section>
			)}
		</>
	)
}
