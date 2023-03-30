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
	PMForm,
	ValidationMessage,
	PasswordStrength,
} from '@/components'

export const Registration = () => {
	// constants
	const { CREDENTIALS, STATUS, INPUT_VALIDATION, VALID_PASSWORD, EMAIL_REGEX, PASSWORD_REGEX } =
		REGISTER_STATE
	const { alphabet, minLength, number, symbol } = PASSWORD_REGEX
	// form controlled inputs
	const { resetInputState, inputAttributes } = useInput<TCredentials>(CREDENTIALS)
	// destructure
	const { inputStates, onChange, onFocus, onBlur, inputFocus } = inputAttributes
	const { password, email, confirm, isTermsAgreed } = inputStates
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
	const { authInfo, updateAuthInfo } = useAuthContext()

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
	}, [success, submit])

	useEffect(() => {
		inputValidationCb()

		setRegistrationStatus(prev => ({ ...prev, errMsg: '' }))
	}, [inputValidationCb])

	const resetRegistration = () => {
		resetInputState()
		setRegistrationStatus(STATUS)
		setLoginValidation(INPUT_VALIDATION)
		setTestPassword(VALID_PASSWORD)
		Log(authInfo)
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		if (!submit) {
			setRegistrationStatus(prev => ({ ...prev, errMsg: '' }))
			setSubmit(true)
			RunAfterSomeTime(() => {
				if (Object.values(loginValidation).every(Boolean)) {
					// TODO: use custom API to handle registration

					updateAuthInfo({ ...inputStates, accessToken: 'fakeToken' })
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
			<div className="form-container">
				{success ? (
					<Header>
						<i className="fa fa-check-circle scale-up" />
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

						<PMForm onSubmit={handleSubmit}>
							<div className="input-row">
								<PMForm.Label
									props={{
										label: 'Email Address',
										labelFor: 'email',
										isFulfilled: isValidEmail && !errMsg,
									}}
								/>
								<PMForm.Input
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
									className={inputFocus.email ? '' : isValidEmail ? 'valid' : 'invalid'}
									{...{ onChange, onFocus, onBlur }}
								/>
								<ValidationMessage
									isVisible={!inputFocus.email && !(isValidEmail && !errMsg)}
									validations={emailReq}
								/>
							</div>

							<div className="input-row">
								<PMForm.Label
									props={{
										label: 'Master Password',
										labelFor: 'password',
										isFulfilled: isValidPassword && !errMsg,
									}}
								>
									<PasswordStrength
										password={password}
										regex={MergeRegExObj(PASSWORD_REGEX)}
									/>
								</PMForm.Label>
								<PMForm.Input
									id="password"
									type="password"
									value={password}
									disabled={submit}
									required
									{...{ onChange, onFocus, onBlur }}
									className={inputFocus.password ? '' : isValidPassword ? 'valid' : 'invalid'}
								/>
								<ValidationMessage
									title="Your master password must contain:"
									isVisible={!inputFocus.password && !(isValidPassword && !errMsg)}
									validations={passwordReq}
								/>
							</div>

							<div className="input-row vr">
								<PMForm.Label
									props={{
										label: 'Confirm Master Password',
										labelFor: 'confirm',
										isFulfilled: !inputFocus.confirm && isValidPassword && password === confirm,
									}}
								/>

								<PMForm.Input
									id="confirm"
									type="password"
									value={confirm}
									disabled={submit}
									required
									{...{ onChange, onFocus, onBlur }}
									className={
										inputFocus.confirm
											? ''
											: isValidPassword && password === confirm
											? 'valid'
											: 'invalid'
									}
								/>

								<ValidationMessage
									isVisible={
										!inputFocus.confirm &&
										!(!inputFocus.confirm && isValidPassword && password === confirm)
									}
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
								variant="primary"
								className="accent-bg"
								iconName="fa-user-plus"
								submitted={submit}
								disabled={
									!isTermsAgreed ||
									submit ||
									!isValidEmail ||
									!isValidPassword ||
									password !== confirm
								}
								onClick={() => console.log('Submit button triggered!')}
							>
								Create account
							</SubmitButton>
						</PMForm>

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
