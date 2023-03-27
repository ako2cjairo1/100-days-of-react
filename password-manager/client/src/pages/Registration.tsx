import { FormEvent, useEffect, useRef, useState, useCallback } from 'react'
import styles from '@/assets/modules/Login.module.css'
import { TCredentials, TStatus, TPassword, TInputValidation } from '@/types/global.type'
import { REGISTER_STATE } from '@/services/constants/Registration.constant'
import { RunAfterSomeTime, ExtractValFromRegEx } from '@/services/Utils/password-manager.helper'
import { useInput } from '@/hooks'
import {
	Header,
	LinkLabel,
	RotatingBackdrop,
	Separator,
	AuthProviderSection,
	SubmitButton,
	FormInput,
} from '@/components'
import useAuthContext from '@/hooks/useAuthContext'

export const Registration = () => {
	const { container } = styles
	// constants
	const { CREDENTIALS, STATUS, INPUT_VALIDATION, VALID_PASSWORD, EMAIL_REGEX, PASSWORD_REGEX } =
		REGISTER_STATE
	const { alphabet, minLength, number, symbol } = PASSWORD_REGEX
	// form controlled inputs
	const { resetInputState, inputAttributes } = useInput<TCredentials>(CREDENTIALS)
	// destructure
	const { inputStates, onChange, onFocus, onBlur, inputFocus } = inputAttributes
	const { password, email, confirm } = inputStates
	const [registrationStatus, setRegistrationStatus] = useState<TStatus>(STATUS)
	// destructure
	const { success, errMsg } = registrationStatus
	const [loginValidation, setLoginValidation] = useState<TInputValidation>(INPUT_VALIDATION)
	// destructure
	const { isValidEmail, isValidPassword } = loginValidation
	const [testPassword, setTestPassword] = useState<TPassword>(VALID_PASSWORD)
	// destructure states
	const emailRef = useRef<HTMLInputElement>(null)
	const loginRef = useRef<HTMLAnchorElement>(null)
	const [submit, setSubmit] = useState(false)
	const { auth, updateAuthCb } = useAuthContext()

	const inputValidationCb = useCallback(() => {
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
	}, [inputStates])

	useEffect(() => {
		if (!registrationStatus.success) emailRef.current?.focus()
		else loginRef.current?.focus()
	}, [registrationStatus.success, submit])

	useEffect(() => {
		inputValidationCb()

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
			setRegistrationStatus(prev => ({ ...prev, errMsg: '' }))
			setSubmit(true)
			RunAfterSomeTime(() => {
				if (Object.values(loginValidation).every(cred => cred === true)) {
					// TODO: use custom API to handle registration

					updateAuthCb({ ...inputStates, accessToken: 'fakeToken' })
					resetRegistration()
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

	const { emailReq, passwordReq, confirmReq } = {
		emailReq: [{ isValid: isValidEmail, message: 'Input is not a valid email address.' }],
		passwordReq: [
			{
				isValid: testPassword.alphabet,
				message: 'an upper and a lower case letter',
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
		confirmReq: [
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
							Registration completed! <i className="fa fa-check-circle scaleup" />
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
								<FormInput
									id="email"
									type="email"
									inputMode="email"
									autoComplete="email"
									autoCapitalize="none"
									placeholder="sample@email.com"
									value={email}
									linkRef={emailRef}
									disabled={submit}
									required
									label="Email Address"
									isFocused={inputFocus.email}
									isValid={isValidEmail && !errMsg}
									validations={emailReq}
									className={inputFocus.email ? '' : isValidEmail ? 'valid' : 'invalid'}
									{...{ onChange, onFocus, onBlur }}
								/>
							</div>

							<div className="input-row">
								<FormInput
									id="password"
									type="password"
									value={password}
									disabled={submit}
									required
									havePasswordMeter={true}
									label="Master Password"
									isFocused={inputFocus.password}
									isValid={isValidPassword && !errMsg}
									validations={passwordReq}
									title="Your master password must contain:"
									{...{ onChange, onFocus, onBlur }}
									className={inputFocus.password ? '' : isValidPassword ? 'valid' : 'invalid'}
								/>
							</div>

							<div className="input-row vr">
								<FormInput
									id="confirm"
									type="password"
									value={confirm}
									disabled={submit}
									required
									label="Confirm Master Password"
									isFocused={inputFocus.confirm}
									isValid={!inputFocus.confirm && isValidPassword && password === confirm}
									validations={confirmReq}
									{...{ onChange, onFocus, onBlur }}
									className={
										inputFocus.confirm
											? ''
											: isValidPassword && password === confirm
											? 'valid'
											: 'invalid'
									}
								/>
							</div>

							<SubmitButton
								iconName="fa-user-plus"
								submitted={submit}
								disabled={submit || !isValidEmail || !isValidPassword || password !== confirm}
								onClick={() => console.log('Submit button triggered!')}
							>
								Create account
							</SubmitButton>
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
							<AuthProviderSection
								cb={() =>
									setRegistrationStatus(prev => ({
										...prev,
										errMsg: 'TODO: Implement external authentication.',
									}))
								}
							/>
						</footer>
					</>
				)}
			</div>
		</section>
	)
}