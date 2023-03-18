import { FormEvent, useEffect, useRef, useState, useContext } from 'react'
import styles from '@/assets/modules/Login.module.css'
import { AuthContext } from '@/services/context'
import { TCredentials, TStatus, TPassword, TValidation } from '@/types/PasswordManager.type'
import { registerInitState } from '@/services/constants/REGISTRATION'
import {
	RunAfterSomeTime,
	MergeRegExObj,
	ExtractValFromRegEx,
} from '@/services/Utils/passwordManagerHelper'
import { useInput } from '@/hooks/useInput'
import {
	Header,
	ValidationMessage,
	LinkLabel,
	PasswordStrength,
	RotatingBackdrop,
	Separator,
	Socials,
	SubmitButton,
	RequiredLabel,
} from '@/components'

export const Registration = () => {
	const { container } = styles
	// constants
	const { CREDENTIALS, STATUS, INPUT_VALIDATION, VALID_PASSWORD, EMAIL_REGEX, PASSWORD_REGEX } =
		registerInitState
	const { alphabet, minLength, number, symbol } = PASSWORD_REGEX

	// form controlled inputs
	const { resetInputState, inputAttributes } = useInput<TCredentials>(CREDENTIALS)
	// destructure
	const { inputStates, onChange, onFocus, onBlur, focusEvents } = inputAttributes
	const { password, email, confirm } = inputStates

	const [registrationStatus, setRegistrationStatus] = useState<TStatus>(STATUS)
	// destructure
	const { success, errMsg } = registrationStatus

	const [loginValidation, setLoginValidation] = useState<TValidation>(INPUT_VALIDATION)
	// destructure
	const { isValidEmail, isValidPassword } = loginValidation

	const [testPassword, setTestPassword] = useState<TPassword>(VALID_PASSWORD)
	// destructure states

	const emailRef = useRef<HTMLInputElement>(null)
	const loginRef = useRef<HTMLAnchorElement>(null)

	const [submit, setSubmit] = useState(false)
	const { auth, setAuth } = useContext(AuthContext)

	useEffect(() => {
		if (!registrationStatus.success) emailRef.current?.focus()
		else loginRef.current?.focus()
	}, [registrationStatus.success, submit])

	useEffect(() => {
		const validPassword = {
			minLength: minLength.test(password),
			alphabet: alphabet.test(password),
			number: number.test(password),
			symbol: symbol.test(password),
		}

		setTestPassword(validPassword)
		setLoginValidation({
			isValidEmail: EMAIL_REGEX.test(email),
			isValidPassword: Object.values(validPassword).every(validation => validation === true),
		})
		setRegistrationStatus(prev => ({ ...prev, errMsg: '' }))
	}, [inputStates])

	const resetRegistration = () => {
		resetInputState()
		setRegistrationStatus(STATUS)
		setLoginValidation(INPUT_VALIDATION)
		setTestPassword(VALID_PASSWORD)
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		if (!submit) {
			setSubmit(true)
			RunAfterSomeTime(() => {
				if (Object.values(loginValidation).every(cred => cred === true)) {
					// TODO: use custom API to handle registration
					setAuth({ ...inputStates, accessToken: '' })
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
			}, 3)
		}
	}

	const { emailValidation, passwordValidation, confirmValidation } = {
		emailValidation: [{ isValid: isValidEmail, message: 'Input is not a valid email address.' }],
		passwordValidation: [
			{
				isValid: testPassword.alphabet,
				message: 'a upper and a lower case letter',
			},
			{
				isValid: testPassword.number,
				message: 'a number',
			},
			{
				isValid: testPassword.minLength,
				message: `at least ${ExtractValFromRegEx(minLength.source)} characters`,
			},
			{
				isValid: testPassword.symbol,
				message: `a special character: ${ExtractValFromRegEx(symbol.source)}`,
			},
		],
		confirmValidation: [
			{
				isValid: isValidPassword && password === confirm,
				message: 'Master password confirmation does not match.',
			},
		],
	}

	return (
		<section>
			<RotatingBackdrop />

			<div className={container}>
				{success ? (
					<Header>
						<h1>
							Registration completed! <i className="fa fa-check" />
						</h1>
						<LinkLabel
							linkRef={loginRef}
							routeTo="/login"
							preText="Proceed to"
						>
							login?
						</LinkLabel>
					</Header>
				) : (
					<>
						<Header
							title="Create Account"
							status={registrationStatus}
						/>

						<form onSubmit={handleSubmit}>
							<div className="input-row">
								<RequiredLabel
									labelFor="email"
									label="Email Address"
									isFulfilled={isValidEmail}
								/>
								<input
									className={!focusEvents.email ? (isValidEmail ? 'valid' : 'invalid') : ''}
									disabled={submit}
									ref={emailRef}
									id="email"
									type="text"
									inputMode="email"
									autoComplete="email"
									autoCapitalize="none"
									placeholder="sample@email.com"
									{...{ onChange, onFocus, onBlur }}
									value={email}
									required
								/>
								<ValidationMessage
									isVisible={!focusEvents.email && !isValidEmail}
									validations={emailValidation}
								/>
							</div>

							<div className="input-row">
								<div className="password-label">
									<RequiredLabel
										labelFor="password"
										label="Master Password"
										isFulfilled={isValidPassword}
									/>
									<PasswordStrength {...{ password, regex: MergeRegExObj(PASSWORD_REGEX) }} />
								</div>
								<input
									className={!focusEvents.password ? (isValidPassword ? 'valid' : 'invalid') : ''}
									disabled={submit}
									id="password"
									type="password"
									{...{ onChange, onFocus, onBlur }}
									value={password}
									required
								/>
								<ValidationMessage
									title="Your master password must contain:"
									isVisible={!focusEvents.password && !isValidPassword}
									validations={passwordValidation}
								/>
							</div>

							<div className="input-row">
								<RequiredLabel
									labelFor="confirm"
									label="Confirm Master Password"
									isFulfilled={isValidPassword && password === confirm}
								/>
								<input
									className={
										!focusEvents.confirm
											? password === confirm
												? password.length > 0 && (password ? password.length > 0 : false)
													? 'valid'
													: ''
												: 'invalid'
											: ''
									}
									disabled={submit}
									id="confirm"
									type="password"
									{...{ onChange, onFocus, onBlur }}
									value={confirm}
									required
								/>
								<ValidationMessage
									isVisible={!focusEvents.confirm && !(password === confirm)}
									validations={confirmValidation}
								/>
							</div>

							<SubmitButton
								text="Create account"
								iconName="fa-user-plus"
								submitted={submit}
								disabled={!isValidEmail || !isValidPassword || password !== confirm}
								onClick={() => console.log('Submit button triggered!')}
							/>
						</form>

						<LinkLabel
							routeTo="/login"
							preText="Already have an account?"
						>
							Log in
						</LinkLabel>

						<Separator>OR</Separator>

						<p className="center small">Continue with...</p>

						<footer>
							<Socials />
						</footer>
					</>
				)}
			</div>
		</section>
	)
}
