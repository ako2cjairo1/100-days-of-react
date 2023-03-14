import { ChangeEvent, FormEvent, useEffect, useRef, useState, useContext } from 'react'
import { AuthContext } from '../context/AuthProvider'
import { TCredentials, TStatus, TPassword, TValidation } from '@/types/PasswordManager.type'
import styles from '../modules/Login.module.css'
import { Socials } from './Socials'
import { registerInitState } from '../constants/REGISTRATION'

export const Registration = () => {
	const { container, background, shape } = styles
	const { CREDENTIALS, STATUS, INPUT_VALIDATION, VALID_PASSWORD, EMAIL_REGEX, PASSWORD_REGEX } =
		registerInitState

	const [formInput, setFormInput] = useState<TCredentials>(CREDENTIALS)
	const [registrationStatus, setRegistrationStatus] = useState<TStatus>(STATUS)
	const [loginValidation, setLoginValidation] = useState<TValidation>(INPUT_VALIDATION)
	const [isValidPassword, setIsValidPassword] = useState<TPassword>(VALID_PASSWORD)
	const userRef = useRef<HTMLInputElement>(null)
	const errRef = useRef<HTMLInputElement>(null)
	const [submit, setSubmit] = useState(false)
	const { auth, setAuth } = useContext(AuthContext)

	useEffect(() => {
		userRef.current?.focus()
	}, [])

	useEffect(() => {
		const validPassword = {
			minLength: PASSWORD_REGEX.minLength.test(formInput.password),
			alphabet: PASSWORD_REGEX.alphabet.test(formInput.password),
			number: PASSWORD_REGEX.number.test(formInput.password),
			symbol: PASSWORD_REGEX.symbol.test(formInput.password),
		}
		setIsValidPassword(validPassword)
		setLoginValidation({
			username: EMAIL_REGEX.test(formInput.username),
			password: Object.values(validPassword).every(validation => validation === true),
		})
		setRegistrationStatus(prev => ({ ...prev, errMsg: '' }))
	}, [formInput])

	const resetRegistration = () => {
		setFormInput(CREDENTIALS)
		setRegistrationStatus(STATUS)
		setLoginValidation(INPUT_VALIDATION)
		setIsValidPassword(VALID_PASSWORD)
		userRef.current?.focus()
	}

	const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
		try {
			const { id, value } = e.target
			setFormInput(prev => ({ ...prev, [id]: value }))
		} catch (error) {
			setRegistrationStatus({ success: false, errMsg: `${error}` })
		}
	}
	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		if (!submit) {
			setSubmit(true)

			const timeout = setTimeout(() => {
				if (Object.values(loginValidation).every(cred => cred === true)) {
					// TODO: use custom API to handle registration
					setAuth({ ...formInput, accessToken: '' })
					resetRegistration()
					alert('TODO: Implement registration')
					setRegistrationStatus({ success: true, errMsg: '' })
				} else {
					setRegistrationStatus({
						success: false,
						errMsg: 'Registration Failed!',
					})
				}

				setSubmit(false)
				clearTimeout(timeout)
			}, 3000)
		}
	}

	return (
		<>
			{registrationStatus.success ? (
				<section className={container}>
					<h1>
						Registration completed! <i className="fa fa-check" />
					</h1>
					<p>
						<a href="#">Proceed to login?</a>
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
								<h1>Create Account</h1>
								{registrationStatus.errMsg ? (
									<p
										className={`center error`}
										ref={errRef}
										aria-live="assertive"
									>
										<i className="fa fa-exclamation-triangle" />
										{registrationStatus.errMsg}
									</p>
								) : null}
							</header>
							<div className="input-row">
								<label htmlFor="username">
									Email Address{' '}
									{loginValidation.username ? (
										<i className="fa fa-check" />
									) : (
										<i className="xsmall"> (required)</i>
									)}
								</label>
								<input
									className={loginValidation.username ? 'valid' : 'invalid'}
									id="username"
									type="text"
									placeholder="sample@gmail.com"
									ref={userRef}
									autoComplete="off"
									onChange={handleInput}
									value={formInput.username}
									required
								/>
								{!loginValidation.username && (
									<ul className="xsmall fa-ul">
										<li>
											<i
												className={`fa-li fa ${loginValidation.username ? 'fa-check-circle' : 'fa-exclamation-circle'
													}`}
											></i>
											Input is not a valid email address.
										</li>
									</ul>
								)}

							</div>

							<div className="input-row">
								<label htmlFor="password">
									Master Password{' '}
									{loginValidation.password ? (
										<i className="fa fa-check" />
									) : (
										<i className="xsmall"> (required)</i>
									)}
								</label>
								<input
									className={loginValidation.password ? 'valid' : 'invalid'}
									id="password"
									type="password"
									onChange={handleInput}
									value={formInput.password}
									required
								/>
								{!loginValidation.password && (
									<ul className="xsmall fa-ul">
										<li>
											<i
												className={`fa-li fa ${isValidPassword.minLength ? 'fa-check-circle' : 'fa-exclamation-circle'
													}`}
											></i>
											minimum of 12 characters
										</li>
										<li>
											<i
												className={`fa-li fa ${isValidPassword.alphabet ? 'fa-check-circle' : 'fa-exclamation-circle'
													}`}
											></i>
											lower case and upper case letter
										</li>
										<li>
											<i
												className={`fa-li fa ${isValidPassword.number ? 'fa-check-circle' : 'fa-exclamation-circle'
													}`}
											></i>
											contains a number
										</li>
										<li>
											<i
												className={`fa-li fa ${isValidPassword.symbol ? 'fa-check-circle' : 'fa-exclamation-circle'
													}`}
											></i>
											contains special character -!@.#$,%^_&*
										</li>
									</ul>
								)}

							</div>

							<div className="input-row">
								<label htmlFor="confirm">
									Confirm Master Password{' '}
									{loginValidation.password && formInput.password === formInput.confirm ? (
										<i className="fa fa-check" />
									) : (
										<i className="xsmall">(required)</i>
									)}
								</label>
								<input
									className={
										loginValidation.password && formInput.password === formInput.confirm
											? 'valid'
											: 'invalid'
									}
									id="confirm"
									type="password"
									onChange={handleInput}
									value={formInput.confirm}
									required
								/>
								{!(loginValidation.password && formInput.password === formInput.confirm) && (
									<ul className="xsmall fa-ul">
										<li>
											<i
												className={`fa-li fa ${loginValidation.password && formInput.password === formInput.confirm
													? 'fa-check-circle'
													: 'fa-exclamation-circle'
													}`}
											></i>
											Master password confirmation does not match.
										</li>
									</ul>
								)}

							</div>

							<button
								disabled={
									!loginValidation.username ||
									!loginValidation.password ||
									formInput.password !== formInput.confirm
								}
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
										<i className="fa fa-user-plus" /> Register
									</>
								)}
							</button>
						</form>
						<p className="small">
							Already have an account?<a href="#">Login</a>
						</p>
						<Socials />
					</div>
				</section>
			)}
		</>
	)
}
