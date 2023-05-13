import { useCallback, useEffect, useRef, useState } from 'react'
import '@/assets/modules/Login.css'
import type { TInputLogin, TStatus } from '@/types'
import { LOGIN_STATE, REGISTER_STATE } from '@/services/constants'
import { useInput, useAuthContext, useStateObj } from '@/hooks'
import {
	ExtractValFromRegEx,
	LocalStorage,
	RunAfterSomeTime,
} from '@/services/Utils/password-manager.helper'
import {
	LinkLabel,
	Separator,
	AuthProviderSection,
	SubmitButton,
	Toggle,
	FormGroup,
	ValidationMessage,
	AnimatedIcon,
	Header,
	ProcessIndicator,
} from '@/components'
import { ssoService } from '@/services/api'

// constants
const { PASSWORD_REGEX, EMAIL_REGEX } = REGISTER_STATE
const { minLength } = PASSWORD_REGEX

export function Login() {
	// custom form input hook
	const { inputAttribute, inputAction } = useInput<TInputLogin>(LOGIN_STATE.Credential)
	// destructure useInput hook
	const { isSubmit, mutate: updateInput, resetInput } = inputAction
	const { inputStates, isFocus, onChange, onFocus, onBlur, isSubmitted } = inputAttribute
	const { email, password, isRemember } = inputStates

	const [isEmailInput, setIsEmailInput] = useState(true)
	const { objState: loginStatus, mutate: updateLoginStatus } = useStateObj<TStatus>(
		LOGIN_STATE.Status
	)
	const emailInputRef = useRef<HTMLInputElement>(null)
	const passwordInputRef = useRef<HTMLInputElement>(null)
	const securedVaultLinkRef = useRef<HTMLAnchorElement>(null)
	const savedEmailRef = useRef(true)
	const {
		authenticate,
		authInfo: { isLoggedIn },
	} = useAuthContext()
	const authRef = useRef(true)
	const [loading, setLoading] = useState(false)

	const authenticateSession = useCallback(() => {
		if (authRef.current && !isLoggedIn) {
			// show authentication progress window
			setLoading(true)
			updateLoginStatus({ status: false, message: '' })
			// authenticate current session by verifying to auth server
			authenticate().then(({ success, message }) => {
				// hide authentication progress window
				setLoading(false)
				// show success or failed authentication
				updateLoginStatus({ success, message })
			})
			authRef.current = false
		}
	}, [authenticate, isLoggedIn, updateLoginStatus])

	// side-effect to persist authentication
	useEffect(() => {
		authenticateSession()
	}, [authenticateSession])

	// side-effect to remember user's email..
	useEffect(() => {
		// email ref, to ensure do this only once
		if (savedEmailRef.current) {
			const rememberedEmail = LocalStorage.read('PM_remember_email')
			// load remembered email from local storage
			updateInput({
				email: rememberedEmail,
				isRemember: rememberedEmail ? true : false,
			})
			savedEmailRef.current = false
		}
		emailInputRef.current?.focus()
	}, [updateInput])

	// side-effect to determine focused control
	useEffect(() => {
		// focus to link button "proceed to secured vault"
		if (loginStatus.success) return securedVaultLinkRef.current?.focus()
		// focus to email input control
		if (isEmailInput) return emailInputRef.current?.focus()
		// else, focus on password input control
		passwordInputRef.current?.focus()
	}, [isEmailInput, loginStatus.success, isSubmitted])

	// side-effect to reset notification message when user is actively typing
	useEffect(() => {
		if (inputStates) updateLoginStatus({ message: '' })
	}, [inputStates, updateLoginStatus])

	// 2 step submit: email and password.
	// User has option to go back and update their inputted email if necessary
	const handleSubmit = (formEvent: React.FormEvent) => {
		formEvent.preventDefault()

		updateLoginStatus({ message: '' })
		if (isEmailInput) {
			// move to password input
			setIsEmailInput(false)
			// option to save email, delete in LS otherwise
			return isRemember
				? LocalStorage.write('PM_remember_email', email)
				: LocalStorage.remove('PM_remember_email')
		}

		if (!isSubmitted) {
			// indicate start progress status of submit button
			isSubmit(true)
			// authenticate credential via auth server
			authenticate({ email, password }).then(({ success, message }) => {
				if (success) {
					// clear input form states and status
					resetInput()
				}
				// show success or failed authentication
				updateLoginStatus({ success, message })
				// end progress status of submit button
				isSubmit(false)
			})

		}
	}

	const changeEmailInput = () => {
		// clear password (if any)
		resetInput('password')
		// go back and change inputted email
		setIsEmailInput(true)
	}

	const checkIf = {
		minLengthPassed: minLength.test(password),
		isValidEmail: EMAIL_REGEX.test(email),
	}

	// form validation criteria
	const { emailValidation, passwordValidation } = {
		emailValidation: [{ isValid: checkIf.isValidEmail, message: 'Input is not a valid email' }],
		passwordValidation: [
			{
				isValid: checkIf.minLengthPassed,
				message: `Input must be at least
				${ExtractValFromRegEx(minLength.source)}
				characters long.`,
			},
		],
	}

	// process indicator while oAuth
	if (loading)
		return (
			<ProcessIndicator
				title="Please wait..."
				subTitle={loginStatus.message}
			/>
		)

	return (
		<section>
			<div className="form-container">
				{loginStatus.success ? (
					<Header>
						<AnimatedIcon
							className="scale-up"
							iconName="fa fa-check-circle"
						/>
						<Header.Title
							title="You are logged in!"
							subTitle={loginStatus.message}
						>
							<LinkLabel
								linkRef={securedVaultLinkRef}
								routeTo="/vault"
								preText="Proceed to your"
							>
								secured vault
							</LinkLabel>
						</Header.Title>
					</Header>
				) : (
					<>
						<Header>
							<Header.Logo />
							<Header.Title
								title="Welcome back"
								subTitle="Log in or create a new account to access your secured vault"
							/>
							<Header.Status status={loginStatus} />
						</Header>

						<FormGroup onSubmit={handleSubmit}>
							{isEmailInput ? (
								<div className="input-row vr">
									<FormGroup.Label
										props={{
											label: 'Email Address',
											labelFor: 'email',
											isFulfilled: checkIf.isValidEmail,
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
										disabled={isSubmitted}
										className={!checkIf.isValidEmail ? (!isFocus.email ? 'invalid' : '') : ''}
										{...{ onChange, onFocus, onBlur }}
									/>
									<ValidationMessage
										isVisible={email.length > 0 && !checkIf.isValidEmail}
										validations={emailValidation}
									/>
								</div>
							) : (
								<div className={`input-row vr ${!isEmailInput ? 'descend' : ''}`}>
									<FormGroup.Label
										props={{
											label: 'Master Password',
											labelFor: 'password',
											isFulfilled: checkIf.minLengthPassed,
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
										className={!checkIf.minLengthPassed ? (!isFocus.password ? 'invalid' : '') : ''}
										{...{ onChange, onFocus, onBlur }}
									/>
									<ValidationMessage
										isVisible={password.length > 0 && !checkIf.minLengthPassed}
										validations={passwordValidation}
									/>
								</div>
							)}

							{isEmailInput && (
								<Toggle
									id="isRemember"
									checked={isRemember}
									{...{ onChange, onFocus, onBlur }}
								>
									<Toggle.Description checked={isRemember}>Remember email?</Toggle.Description>
									<Toggle.Description checked={!isRemember}>
										Ok, we`ll remember your email.
									</Toggle.Description>
								</Toggle>
							)}

							<div className="center">
								<SubmitButton
									props={{
										variant: 'primary',
										textStatus: 'Logging in...',
										iconName: isEmailInput ? '' : 'fa fa-sign-in',
										submitted: isSubmitted,
										disabled:
											isSubmitted ||
											(isEmailInput ? !checkIf.isValidEmail : !checkIf.minLengthPassed),
									}}
								>
									{isEmailInput ? 'Continue' : 'Log in with Master Password'}
								</SubmitButton>
							</div>
						</FormGroup>

						{isEmailInput ? (
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
								onClick={changeEmailInput}
							>
								Not you?
							</LinkLabel>
						)}

						<div>
							<Separator>OR</Separator>
							<p className="center small">Continue with...</p>
						</div>

						<footer>
							<AuthProviderSection
								callbackFn={provider => {
									setLoading(true)
									updateLoginStatus({ message: `Sign-in via ${provider}` })

									RunAfterSomeTime(() => {
										if (!loading) {
											setLoading(false)
											updateLoginStatus({
												success: false,
												message: `${provider} didn't respond, please try again`,
											})
										}
									}, 5)

									// call sso, expect callback from provider on side-effects (Login render)
									ssoService(provider)
								}}
							/>
						</footer>
					</>
				)}
			</div>
		</section>
	)
}
