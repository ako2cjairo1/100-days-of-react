import { useEffect, useRef, useState } from 'react'
import '@/assets/modules/Login.css'
import { TCredentials, TStatus } from '@/types/global.type'
import { useInput, useAuthContext } from '@/hooks'
import { LOGIN_STATE, REGISTER_STATE } from '@/services/constants'
import {
	CreateError,
	ExtractValFromRegEx,
	LocalStorage,
	Log,
	RunAfterSomeTime,
} from '@/services/Utils/password-manager.helper'
import {
	Header,
	LinkLabel,
	Separator,
	AuthProviderSection,
	SubmitButton,
	Toggle,
	FormGroup,
	ValidationMessage,
} from '@/components'

export const Login = () => {
	const { PASSWORD_REGEX, EMAIL_REGEX } = REGISTER_STATE
	const { minLength } = PASSWORD_REGEX
	// constants
	// custom form input hook
	const { inputAttributes, resetInputState } = useInput<TCredentials>(LOGIN_STATE.Credential)
	// destructure
	const { inputStates, inputFocus, onChange, onFocus, onBlur, setInputStates } = inputAttributes
	const { email, password, isRemember } = inputStates
	const [loginStatus, setLoginStatus] = useState<TStatus>(LOGIN_STATE.Status)
	// destructure states
	const { success, errMsg } = loginStatus
	const emailInputRef = useRef<HTMLInputElement>(null)
	const passwordInputRef = useRef<HTMLInputElement>(null)
	const vaultLinkRef = useRef<HTMLAnchorElement>(null)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [isInputEmail, setIsInputEmail] = useState(true)
	const { authInfo, updateAuthInfo } = useAuthContext()

	useEffect(() => {
		const cachedEmail = LocalStorage.get('password_manager_email') ?? ''
		setInputStates(prev => ({
			...prev,
			email: cachedEmail,
			isRemember: cachedEmail ? true : false,
		}))
	}, [setInputStates])

	useEffect(() => {
		if (isInputEmail) emailInputRef.current?.focus()
		else if (success) vaultLinkRef.current?.focus()
		else passwordInputRef.current?.focus()

		vaultLinkRef.current?.focus()
	}, [success, isInputEmail, isSubmitted])

	useEffect(() => {
		setLoginStatus(prev => ({ ...prev, errMsg: '' }))
	}, [inputStates])

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		setLoginStatus(prev => ({ ...prev, errMsg: '' }))
		if (isInputEmail) {
			setIsInputEmail(false)
			if (isRemember) LocalStorage.set('password_manager_email', email)
			else LocalStorage.remove('password_manager_email')

			return true
		}

		if (!isSubmitted) {
			setIsSubmitted(true)
			RunAfterSomeTime(() => {
				try {
					// TODO: fetch access token to custom authentication backend api
					// throw new Error(
					// 	// '[TEST]: There is no Vercel account associated with this email address. Sign up?'
					// 	'[TEST]: An error has occurred. E-mail or Password is incorrect. Try again'
					// )

					updateAuthInfo({ ...inputStates, accessToken: 'fake token' })
					setLoginStatus({ success: true, errMsg: '' })
					resetInputState()

					setIsSubmitted(false)
				} catch (error) {
					setIsSubmitted(false)
					setLoginStatus({ success: false, errMsg: CreateError(error).message })
					return false
				}
			}, 3)
		}

		return true
	}

	const handleChangeEmail = () => {
		resetInputState('password')
		setIsInputEmail(true)
		Log(authInfo)
	}

	const isMinLength = minLength.test(password)
	const isValidEmail = EMAIL_REGEX.test(email)

	const { emailValidation, passwordValidation } = {
		emailValidation: [{ isValid: isValidEmail, message: 'Input is not a valid email' }],
		passwordValidation: [
			{
				isValid: isMinLength,
				message: `Input must be at least
				${ExtractValFromRegEx(minLength.source)}
				characters long.`,
			},
		],
	}

	return (
		<section>
			<div className="form-container">
				{success ? (
					<Header>
						<i className="fa fa-check-circle scale-up" />
						<Header.Title title="You are logged in!">
							<LinkLabel
								linkRef={vaultLinkRef}
								routeTo="/secure-vault"
								preText="Proceed to your secured"
							>
								password vault
							</LinkLabel>
						</Header.Title>
					</Header>
				) : (
					<>
						<Header>
							<Header.Title
								title="Welcome back"
								subTitle="Log in or create a new account to access your secured vault"
							/>
							<Header.Status status={loginStatus} />
						</Header>

						<FormGroup onSubmit={handleSubmit}>
							{isInputEmail ? (
								<div className="input-row vr">
									<FormGroup.Label
										props={{
											label: 'Email Address',
											labelFor: 'email',
											isFulfilled: isValidEmail && !errMsg,
										}}
									/>
									<FormGroup.Input
										id="email"
										type="text"
										inputMode="email"
										autoComplete="email"
										placeholder="Email"
										required
										value={email}
										linkRef={emailInputRef}
										disabled={!isInputEmail || isSubmitted}
										className={!inputFocus.email && (errMsg || !isValidEmail) ? 'invalid' : ''}
										{...{ onChange, onFocus, onBlur }}
									/>
									<ValidationMessage
										isVisible={!inputFocus.email && !(isValidEmail && !errMsg)}
										validations={!errMsg ? emailValidation : []}
									/>
								</div>
							) : (
								<div className={`input-row vr ${!isInputEmail ? 'descend' : ''}`}>
									<FormGroup.Label
										props={{
											label: 'Master Password',
											labelFor: 'password',
											isFulfilled: isMinLength && !errMsg,
										}}
									/>
									<FormGroup.Input
										id="password"
										type="password"
										placeholder="Password"
										required
										value={password}
										linkRef={passwordInputRef}
										disabled={isSubmitted}
										className={!inputFocus.password && (errMsg || !isMinLength) ? 'invalid' : ''}
										{...{ onChange, onFocus, onBlur }}
									/>
									<ValidationMessage
										isVisible={!inputFocus.password && !(isMinLength && !errMsg)}
										validations={!errMsg ? passwordValidation : []}
									/>
								</div>
							)}

							{isInputEmail && (
								<Toggle
									id="isRemember"
									checked={isRemember}
									// disabled={!(email.length > 0) && !isValidEmail}
									{...{ onChange, onFocus, onBlur }}
								>
									<Toggle.Description checked={isRemember}>Remember email?</Toggle.Description>
									<Toggle.Description checked={!isRemember}>
										Ok, we`ll remember your email.
									</Toggle.Description>
								</Toggle>
							)}

							<SubmitButton
								variant="primary"
								iconName={isInputEmail ? '' : 'fa-sign-in'}
								submitted={isSubmitted}
								disabled={
									isSubmitted || (isInputEmail ? !isValidEmail : !(isValidEmail && isMinLength))
								}
							>
								{isInputEmail ? 'Continue' : 'Log in with Master Password'}
							</SubmitButton>
						</FormGroup>

						{isInputEmail ? (
							<LinkLabel
								routeTo="/registration"
								preText="New around here?"
							>
								Create account
							</LinkLabel>
						) : (
							<LinkLabel
								routeTo="/login"
								preText={`Logging in as ${email}`}
								onClick={handleChangeEmail}
							>
								Not you?
							</LinkLabel>
						)}

						<Separator>OR</Separator>

						<p className="center small">Continue with...</p>

						<footer>
							<AuthProviderSection
								cb={() =>
									setLoginStatus(prev => ({
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
