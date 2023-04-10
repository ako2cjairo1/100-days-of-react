import { FormEvent, useEffect, useRef, useState, useCallback } from 'react'
import '@/assets/modules/Login.css'
import { TCredentials, TStatus, TPassword, TInputValidation } from '@/types/global.type'
import { REGISTER_STATE } from '@/services/constants/Registration.constant'
import {
	RunAfterSomeTime,
	ExtractValFromRegEx,
	Log,
	MergeRegExObj,
} from '@/services/Utils/password-manager.helper'
import { useInput, useAuthContext } from '@/hooks'
import {
	Header,
	LinkLabel,
	Separator,
	AuthProviderSection,
	SubmitButton,
	Toggle,
	FormGroup,
	ValidationMessage,
	PasswordStrength,
	AnimatedIcon,
} from '@/components'

export const Registration = () => {
	// constants
	const { CREDENTIALS, STATUS, INPUT_VALIDATION, VALID_PASSWORD, EMAIL_REGEX, PASSWORD_REGEX } =
		REGISTER_STATE
	const { alphabet, minLength, number, symbol } = PASSWORD_REGEX
	// form controlled inputs
	const { inputAttribute, inputAction } = useInput<TCredentials>(CREDENTIALS)
	// destructure
	const { inputStates, onChange, onFocus, onBlur, isFocus, isSubmitted } = inputAttribute
	const { password, email, confirm, isTermsAgreed } = inputStates
	const [registrationStatus, setRegistrationStatus] = useState<TStatus>(STATUS)
	// destructure
	const { success, message } = registrationStatus
	const [loginValidation, setLoginValidation] = useState<TInputValidation>(INPUT_VALIDATION)
	// destructure
	const { isValidEmail, isValidPassword } = loginValidation
	const [testPassword, setTestPassword] = useState<TPassword>(VALID_PASSWORD)
	// destructure states
	const emailRef = useRef<HTMLInputElement>(null)
	const loginRef = useRef<HTMLAnchorElement>(null)
	const { authInfo, mutateAuth } = useAuthContext()

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
			isValidPassword: Object.values(validPassword).every(Boolean),
		})
	}, [EMAIL_REGEX, alphabet, email, minLength, number, password, symbol])

	useEffect(() => {
		if (!success) emailRef.current?.focus()
		else loginRef.current?.focus()
	}, [success])

	useEffect(() => {
		inputValidationCb()

		setRegistrationStatus(prev => ({ ...prev, message: '' }))
	}, [inputValidationCb])

	const resetRegistration = () => {
		inputAction.resetInput()
		setRegistrationStatus(STATUS)
		setLoginValidation(INPUT_VALIDATION)
		setTestPassword(VALID_PASSWORD)
		Log(authInfo)
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		if (!isSubmitted) {
			setRegistrationStatus(prev => ({ ...prev, message: '' }))
			inputAction.submit(true)
			RunAfterSomeTime(() => {
				if (Object.values(loginValidation).every(Boolean)) {
					// TODO: use custom API to handle registration

					mutateAuth({ ...inputStates, accessToken: 'fakeToken' })
					resetRegistration()
					setRegistrationStatus({ success: true, message: '' })
				} else {
					setRegistrationStatus({
						success: false,
						message: 'Registration Failed!',
					})
				}

				inputAction.submit(false)
			}, 3)
		}
	}

	const checkIf = {
		validConfirmation: isValidPassword && password === confirm,
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
				isValid: checkIf.validConfirmation,
				message: 'Master password confirmation does not match.',
			},
		],
	}

	return (
		<section>
			<div className="form-container">
				{success ? (
					<Header>
						<AnimatedIcon
							className="scale-up"
							iconName="fa fa-check-circle"
						/>
						<Header.Title title="Registration completed!">
							<LinkLabel
								linkRef={loginRef}
								routeTo="/login"
								preText="Proceed to"
							>
								login?
							</LinkLabel>
						</Header.Title>
					</Header>
				) : (
					<>
						<Header>
							<Header.Title
								title="Create Account"
								subTitle="Create a free account with your email."
							/>
							<Header.Status status={registrationStatus} />
						</Header>

						<FormGroup onSubmit={handleSubmit}>
							<div className="input-row">
								<FormGroup.Label
									props={{
										label: 'Email Address',
										labelFor: 'email',
										isFulfilled: isValidEmail && !message,
									}}
								/>
								<FormGroup.Input
									id="email"
									type="email"
									inputMode="email"
									autoComplete="email"
									autoCapitalize="none"
									placeholder="sample@email.com"
									value={email}
									linkRef={emailRef}
									disabled={isSubmitted}
									required
									className={isFocus.email ? '' : isValidEmail ? 'valid' : 'invalid'}
									{...{ onChange, onFocus, onBlur }}
								/>
								<ValidationMessage
									isVisible={!isFocus.email && !(isValidEmail && !message)}
									validations={emailReq}
								/>
							</div>

							<div className="input-row">
								<FormGroup.Label
									props={{
										label: 'Master Password',
										labelFor: 'password',
										isFulfilled: isValidPassword && !message,
									}}
								>
									<PasswordStrength
										password={password}
										regex={MergeRegExObj(PASSWORD_REGEX)}
									/>
								</FormGroup.Label>
								<FormGroup.Input
									id="password"
									type="password"
									value={password}
									disabled={isSubmitted}
									required
									{...{ onChange, onFocus, onBlur }}
									className={isFocus.password ? '' : isValidPassword ? 'valid' : 'invalid'}
								/>
								<ValidationMessage
									title="Your master password must contain:"
									isVisible={!isFocus.password && !(isValidPassword && !message)}
									validations={passwordReq}
								/>
							</div>

							<div className="input-row vr">
								<FormGroup.Label
									props={{
										label: 'Confirm Master Password',
										labelFor: 'confirm',
										isFulfilled: !isFocus.confirm && checkIf.validConfirmation,
									}}
								/>

								<FormGroup.Input
									id="confirm"
									type="password"
									value={confirm}
									disabled={isSubmitted}
									required
									{...{ onChange, onFocus, onBlur }}
									className={
										isFocus.confirm
											? ''
											: checkIf.validConfirmation
											? 'valid'
											: password.length > 0
											? 'invalid'
											: ''
									}
								/>

								<ValidationMessage
									isVisible={!isFocus.confirm && !checkIf.validConfirmation && password.length > 0}
									validations={confirmReq}
								/>
							</div>

							<Toggle
								id="isTermsAgreed"
								checked={isTermsAgreed}
								{...{ onChange, onFocus, onBlur }}
							>
								<div className="offset-toggle">
									<LinkLabel
										preText="By selecting this option you agree to the following:"
										className="tal"
										routeTo="/terms"
									>
										<br />
										Terms of Service, Privacy Policy
									</LinkLabel>
								</div>
							</Toggle>

							<SubmitButton
								props={{
									variant: 'primary',
									iconName: 'fa-user-plus',
									submitted: isSubmitted,
									disabled:
										!isTermsAgreed ||
										isSubmitted ||
										!isValidEmail ||
										!isValidPassword ||
										password !== confirm,
								}}
								className="accent-bg"
								onClick={() => console.log('Submit button triggered!')}
							>
								Create account
							</SubmitButton>
						</FormGroup>

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
										message: 'TODO: Implement external authentication.',
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
