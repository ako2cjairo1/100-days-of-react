import { FormEvent, useEffect, useRef, useState, useContext } from 'react'
import styles from '@/assets/modules/Login.module.css'
import { TCredentials, TInputFocus, TStatus } from '@/types/PasswordManager.type'
import { AuthContext } from '@/services/context'
import { useInput } from '@/hooks/useInput'
import { loginInitState, registerInitState } from '@/services/constants'
import {
	Header,
	ValidationMessage,
	LinkLabel,
	RotatingBackdrop,
	Separator,
	Socials,
	SubmitButton,
} from '@/components'

export const Login = () => {
	const { container } = styles
	// constants
	const { CREDENTIAL, STATUS } = loginInitState
	const { minLength } = registerInitState.PASSWORD_REGEX
	// custom form input hook
	const { inputAttributes, resetInputState } = useInput<TCredentials>(CREDENTIAL)
	// destructure
	const { inputStates, onChange, onFocus, onBlur, focusEvents } = inputAttributes
	const { email, password } = inputStates

	const [loginStatus, setLoginStatus] = useState<TStatus>(STATUS)
	// destructure states
	const { success, errMsg } = loginStatus

	const emailRef = useRef<HTMLInputElement>(null)
	const passwordRef = useRef<HTMLInputElement>(null)

	const [isSubmitted, setIsSubmitted] = useState(false)
	const [isInputEmail, setIsInputEmail] = useState(true)
	const { auth, setAuth } = useContext(AuthContext)

	useEffect(() => {
		if (isInputEmail) emailRef.current?.focus()
		else passwordRef.current?.focus()
	}, [isInputEmail, isSubmitted])

	useEffect(() => {
		setLoginStatus(prev => ({ ...prev, errMsg: '' }))
	}, [inputStates])

	const isValidPassword = minLength.test(password)
	const isValidEmail = registerInitState.EMAIL_REGEX.test(email)

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		setLoginStatus(prev => ({ ...prev, errMsg: '' }))
		if (isInputEmail) {
			setIsInputEmail(false)
			return
		}

		setIsSubmitted(true)
		const timeout = setTimeout(() => {
			try {
				// TODO: fetch access token to custom authentication backend api
				// throw new Error('test error!')
				setAuth({ ...inputStates, accessToken: '' })
				setLoginStatus({ success: true, errMsg: '' })
				resetInputState()

				setIsSubmitted(false)
			} catch (error) {
				setIsSubmitted(false)
				setLoginStatus({ success: false, errMsg: `${error}` })
			}

			clearTimeout(timeout)
		}, 3000)
	}

	const { emailValidation, passwordValidation } = {
		emailValidation: [{ isValid: isValidEmail, message: 'Input is not a valid email.' }],
		passwordValidation: [
			{
				isValid: isValidPassword,
				message: `Input must be at least
				${minLength.source.match(/\{(.*?)\}/g)}
				characters long.`,
			},
		],
	}

	// useEffect(() => {
	// 	console.log(focusEvents)
	// }, [focusEvents])

	return (
		<section>
			<RotatingBackdrop />
			<div className={container}>
				{success ? (
					<Header>
						<h1>
							You are logged in! <i className="fa fa-check" />
						</h1>
						<LinkLabel
							routeTo="/keychain"
							text="Proceed to your secured"
						>
							keychain
						</LinkLabel>
					</Header>
				) : (
					<>
						<Header
							title="Welcome back"
							subTitle="Log in or create a new account to access your keychain"
							errMsg={errMsg}
						/>

						<form onSubmit={handleSubmit}>
							<div className="input-row">
								{isInputEmail ? (
									// <i class="fa fa-envelope" aria-hidden="true"></i>
									<>
										<input
											ref={emailRef}
											className={!focusEvents.email && (errMsg || !isValidEmail) ? 'invalid' : ''}
											disabled={!isInputEmail || isSubmitted}
											id="email"
											type="email"
											autoComplete="email"
											placeholder="Email"
											value={email}
											required
											{...{ onChange, onFocus, onBlur }}
										/>
										<ValidationMessage
											isVisible={!focusEvents.email && !isValidEmail}
											validations={emailValidation}
										/>
									</>
								) : (
									<>
										<input
											ref={passwordRef}
											className={
												!focusEvents.password && (errMsg || !isValidPassword) ? 'invalid' : ''
											}
											disabled={isSubmitted}
											id="password"
											type="password"
											placeholder="Password"
											value={password}
											required
											{...{ onChange, onFocus, onBlur }}
										/>
										<ValidationMessage
											isVisible={!focusEvents.password && !isValidPassword}
											validations={passwordValidation}
										/>
										<LinkLabel
											routeTo="/reset"
											text="Forgot master password?"
										>
											Reset
										</LinkLabel>
									</>
								)}
							</div>

							<SubmitButton
								text={isInputEmail ? 'Continue' : 'Log in with Master Password'}
								iconName={isInputEmail ? '' : 'fa-sign-in'}
								submitted={isSubmitted}
								disabled={isInputEmail ? !isValidEmail : !(isValidEmail && isValidPassword)}
								onClick={() => console.log('Submit button triggered!')}
							/>
						</form>

						<LinkLabel
							routeTo="/registration"
							text="New around here?"
						>
							Create account
						</LinkLabel>

						<Separator>OR</Separator>

						<p className="small">Continue with...</p>

						<footer>
							<Socials />
						</footer>
					</>
				)}
			</div>
		</section>
	)
}
