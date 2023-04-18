import { useEffect, useRef, useState } from 'react'
import '@/assets/modules/Login.css'
import type { TInputLogin, TStatus } from '@/types'
import { LOGIN_STATE, REGISTER_STATE } from '@/services/constants'
import { useInput, useAuthContext, useStateObj } from '@/hooks'
import {
	CreateError,
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
} from '@/components'

// constants
const { PASSWORD_REGEX, EMAIL_REGEX } = REGISTER_STATE
const { minLength } = PASSWORD_REGEX

export function Login() {
	// custom form input hook
	const { inputAttribute, inputAction } = useInput<TInputLogin>(LOGIN_STATE.Credential)
	// destructure useInput hook
	const { inputStates, isFocus, onChange, onFocus, onBlur, isSubmitted } = inputAttribute
	const { email, password, isRemember } = inputStates

	const [isTypingEmail, setIsTypingEmail] = useState(true)
	const { objState: loginStatus, mutate: updateLoginStatus } = useStateObj<TStatus>(
		LOGIN_STATE.Status
	)
	const emailInputRef = useRef<HTMLInputElement>(null)
	const passwordInputRef = useRef<HTMLInputElement>(null)
	const securedVaultLinkRef = useRef<HTMLAnchorElement>(null)
	const savedEmailRef = useRef(true)
	const { mutateAuth: updateAuthInfo } = useAuthContext()

	useEffect(() => {
		if (savedEmailRef.current) {
			const savedEmailFromLocalStorage = LocalStorage.read('password_manager_email')
			inputAction.mutate({
				email: savedEmailFromLocalStorage,
				isRemember: savedEmailFromLocalStorage ? true : false,
			})
			savedEmailRef.current = false
		}
	}, [inputStates, inputAction])

	useEffect(() => {
		if (isTypingEmail) return emailInputRef.current?.focus()
		if (loginStatus.success) return securedVaultLinkRef.current?.focus()
		passwordInputRef.current?.focus()
	}, [isTypingEmail, loginStatus.success, isSubmitted])

	useEffect(() => {
		updateLoginStatus({ message: '' })
	}, [inputStates, updateLoginStatus])

	const handleSubmit = (formEvent: React.FormEvent) => {
		formEvent.preventDefault()

		updateLoginStatus({ message: '' })
		if (isTypingEmail) {
			setIsTypingEmail(false)
			if (isRemember) LocalStorage.write('password_manager_email', email)
			else LocalStorage.remove('password_manager_email')

			return true
		}

		if (!isSubmitted) {
			inputAction.isSubmit(true)
			RunAfterSomeTime(() => {
				try {
					// TODO: fetch access token to custom authentication backend api
					// throw new Error(
					// 	// '[TEST]: There is no Vercel account associated with this email address. Sign up?'
					// 	'[TEST]: An error has occurred. E-mail or Password is incorrect. Try again'
					// )

					updateAuthInfo({ ...inputStates, accessToken: 'fake token' })
					updateLoginStatus({ success: true, message: '' })
					inputAction.resetInput()
				} catch (error) {
					updateLoginStatus({ success: false, message: CreateError(error).message })
					return false
				} finally {
					inputAction.isSubmit(false)
				}
			}, 3)
		}

		return true
	}

	const handleChangeLoginEmail = () => {
		// clear the password (if any)
		inputAction.resetInput('password')
		// then go back to login email
		setIsTypingEmail(true)
	}

	const checkIf = {
		minLengthPassed: minLength.test(password),
		isValidEmail: EMAIL_REGEX.test(email),
	}

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

	return (
		<section>
			<div className="form-container">
				{loginStatus.success ? (
					<Header>
						<AnimatedIcon
							className="scale-up"
							iconName="fa fa-check-circle"
						/>
						<Header.Title title="You are logged in!">
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
							{isTypingEmail ? (
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
								<div className={`input-row vr ${!isTypingEmail ? 'descend' : ''}`}>
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

							{isTypingEmail && (
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
										iconName: isTypingEmail ? '' : 'fa fa-sign-in',
										submitted: isSubmitted,
										disabled:
											isSubmitted ||
											(isTypingEmail ? !checkIf.isValidEmail : !checkIf.minLengthPassed),
									}}
								>
									{isTypingEmail ? 'Continue' : 'Log in with Master Password'}
								</SubmitButton>
							</div>
						</FormGroup>

						{isTypingEmail ? (
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
								onClick={handleChangeLoginEmail}
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
								callbackFn={() =>
									updateLoginStatus({ message: 'TODO: Implement external authentication.' })
								}
							/>
						</footer>
					</>
				)}
			</div>
		</section>
	)
}
