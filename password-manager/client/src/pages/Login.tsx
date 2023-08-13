import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '@/assets/modules/Login.css'
import google from '@/assets/google.png'
import github from '@/assets/github.png'
import meta from '@/assets/facebook.png'
import type { TInputLogin } from '@/types'
import type { TProvider } from '@shared'
import {
	AnimatedIcon,
	FormGroup,
	Header,
	LinkLabel,
	BusyIndicator,
	Separator,
	SubmitButton,
	Toggle,
	ValidationMessage,
	AuthProviderContainer,
} from '@/components'
import { useInput } from '@/hooks'
import { ExtractValFromRegEx, IsEmpty, LocalStorage, RunAfterSomeTime, hashPassword } from '@/utils'
import { ssoService } from '@/services/api'
import { LOGIN_STATE, REGISTER_STATE } from '@/services/constants'
import { useAppDispatch, useAppSelector } from '@/services/store/hooks'
import {
	fetchAuthSession,
	loginUser,
	selectAuthentication,
	updateAuthStatus,
} from '@/services/store/features'

// constants
const { PASSWORD_REGEX, EMAIL_REGEX } = REGISTER_STATE
const { minLength } = PASSWORD_REGEX

export function Login() {
	// custom form input hook
	const {
		mutate: updateInput,
		resetInput,
		input,
		isFocus,
		onChange,
		onFocus,
		onBlur,
	} = useInput<TInputLogin>(LOGIN_STATE.Credential)
	const updateInputRef = useRef(updateInput)

	const [isEmailInput, setIsEmailInput] = useState(true)
	const emailInputRef = useRef<HTMLInputElement>(null)
	const passwordInputRef = useRef<HTMLInputElement>(null)
	const securedVaultLinkRef = useRef<HTMLAnchorElement>(null)
	const authRef = useRef(true)
	const navigate = useRef(useNavigate())

	// redux attribs
	const dispatch = useRef(useAppDispatch())
	const {
		auth: { isLoggedIn },
		loading,
		message,
		success,
	} = useAppSelector(selectAuthentication)

	// side-effect to persist authentication
	useEffect(() => {
		if (!isLoggedIn && authRef.current) {
			dispatch.current(fetchAuthSession())
			// redirect to login if unsuccessful authentication
			if (!success) navigate.current('/login', { replace: true })
			authRef.current = false
		}
	}, [isLoggedIn, success])

	// side-effect to remember user's email..
	useLayoutEffect(() => {
		const cachedEmail = LocalStorage.read('PM_remember_email')
		// load remembered email from local storage
		updateInputRef.current({
			email: cachedEmail,
			isRemember: !IsEmpty(cachedEmail),
		})
		emailInputRef.current?.focus()
	}, [])

	// side-effect to determine focused control
	useLayoutEffect(() => {
		// focus to link button "proceed to secured vault"
		if (success) return securedVaultLinkRef.current?.focus()
		// focus to email input control
		if (isEmailInput) return emailInputRef.current?.focus()
		// else, focus on password input control
		passwordInputRef.current?.focus()
	}, [isEmailInput, success, loading])

	// side-effect to reset notification message when user is actively typing
	useLayoutEffect(() => {
		if (input) dispatch.current(updateAuthStatus({ message: '' }))
	}, [input])

	// 2 step submit: email and password.
	// User has option to go back and update their inputted email if necessary
	const handleSubmit = (formEvent: React.FormEvent) => {
		formEvent.preventDefault()

		if (isEmailInput) {
			// move to password input
			setIsEmailInput(false)
			// option to save email, delete in LS otherwise
			return input.isRemember
				? LocalStorage.write('PM_remember_email', input.email)
				: LocalStorage.remove('PM_remember_email')
		}

		if (!loading) {
			// authenticate using email and password credential via auth server
			dispatch.current(
				loginUser({
					email: input.email,
					password: hashPassword(input.password),
				})
			)
		}
	}

	const handleSSOProvider = (provider: TProvider) => {
		dispatch.current(
			updateAuthStatus({
				loading: true,
				message: `Sign-in via ${provider}`,
			})
		)

		RunAfterSomeTime(() => {
			if (!loading) {
				dispatch.current(
					updateAuthStatus({
						loading: false,
						success: false,
						message: `${provider} didn't respond, please try again`,
					})
				)
				// reload to get auth (cookies)
				window.location.reload()
			}
		}, 5)

		// call sso, expect callback from provider on side-effects (Login render)
		ssoService(provider)
	}

	const backToEmailInput = () => {
		// clear password (if any)
		resetInput('password')
		// go back and change inputted email
		setIsEmailInput(true)
	}

	const checkIf = {
		minLengthPassed: minLength.test(input.password) && !IsEmpty(input.password),
		isValidEmail: EMAIL_REGEX.test(input.email) && !IsEmpty(input.email),
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
			<BusyIndicator
				title="Please wait..."
				subTitle={message}
			/>
		)

	return (
		<section>
			<div className="form-container">
				{success ? (
					<Header>
						<AnimatedIcon
							iconName="fa fa-regular fa-circle-check"
							animation="fa fa-bounce"
							animateOnLoad
						/>
						<Header.Title
							title="You are logged in!"
							// subTitle={message}
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
							<Header.Status status={{ message, success }} />
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
										value={input.email}
										linkRef={emailInputRef}
										disabled={loading}
										className={!checkIf.isValidEmail ? (!isFocus.email ? 'invalid' : '') : ''}
										{...{ onChange, onFocus, onBlur }}
									/>
									<ValidationMessage
										isVisible={!checkIf.isValidEmail}
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
										value={input.password}
										linkRef={passwordInputRef}
										disabled={loading}
										className={!checkIf.minLengthPassed ? (!isFocus.password ? 'invalid' : '') : ''}
										{...{ onChange, onFocus, onBlur }}
									/>
									<ValidationMessage
										isVisible={!checkIf.minLengthPassed}
										validations={passwordValidation}
									/>
								</div>
							)}

							{isEmailInput && (
								<Toggle
									id="isRemember"
									checked={input.isRemember}
									{...{ onChange, onFocus, onBlur }}
								>
									<Toggle.Description checked={input.isRemember}>
										Remember email?
									</Toggle.Description>
									<Toggle.Description checked={!input.isRemember}>
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
										submitted: !loading && success,
										disabled:
											loading || (isEmailInput ? !checkIf.isValidEmail : !checkIf.minLengthPassed),
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
								preText={`Logging in as ${input.email}`}
								onClick={backToEmailInput}
							>
								Not you?
							</LinkLabel>
						)}

						<div>
							<Separator>OR</Separator>
							<p className="center small">you can sign in with...</p>
						</div>

						<footer>
							<AuthProviderContainer>
								<AuthProviderContainer.Provider
									actionHandler={() => handleSSOProvider('facebook')}
									label="Meta"
									src={meta}
								/>
								<AuthProviderContainer.Provider
									actionHandler={() => handleSSOProvider('google')}
									label="Google"
									src={google}
								/>
								<AuthProviderContainer.Provider
									actionHandler={() => handleSSOProvider('github')}
									label="Github"
									src={github}
								/>
							</AuthProviderContainer>
						</footer>
					</>
				)}
			</div>
		</section>
	)
}
