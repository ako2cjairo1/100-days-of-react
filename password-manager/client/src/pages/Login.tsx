import { FormEvent, useEffect, useRef, useState, useContext } from 'react'
import styles from '@/assets/modules/Login.module.css'
import { TCredentials, TStatus } from '@/types/global.type'
import { AuthContext } from '@/services/context'
import { useInput } from '@/hooks'
import { LOGIN_STATE, REGISTER_STATE } from '@/services/constants'
import {
	CreateErrorObj,
	ExtractValFromRegEx,
	RunAfterSomeTime,
} from '@/services/Utils/password-manager.helper'
import {
	Header,
	LinkLabel,
	FormInput,
	RotatingBackdrop,
	Separator,
	AuthProviderSection,
	SubmitButton,
} from '@/components'

export const Login = () => {
	const { container } = styles
	// constants
	const { minLength } = REGISTER_STATE.PASSWORD_REGEX
	// custom form input hook
	const { inputAttributes, resetInputState } = useInput<TCredentials>(LOGIN_STATE.Credential)
	// destructure
	const { inputStates, inputFocus, onChange, onFocus, onBlur } = inputAttributes
	const { email, password } = inputStates
	const [loginStatus, setLoginStatus] = useState<TStatus>(LOGIN_STATE.Status)
	// destructure states
	const { success, errMsg } = loginStatus
	const emailInputRef = useRef<HTMLInputElement>(null)
	const passwordInputRef = useRef<HTMLInputElement>(null)
	const vaultLinkRef = useRef<HTMLAnchorElement>(null)
	const [isSubmitted, setIsSubmitted] = useState(false)
	const [isInputEmail, setIsInputEmail] = useState(true)
	const { auth, updateAuthCb } = useContext(AuthContext)

	useEffect(() => {
		if (isInputEmail) emailInputRef.current?.focus()
		else if (success) vaultLinkRef.current?.focus()
		else passwordInputRef.current?.focus()
	}, [loginStatus, isInputEmail, isSubmitted])

	useEffect(() => {
		setLoginStatus(prev => ({ ...prev, errMsg: '' }))
	}, [inputStates])

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		setLoginStatus(prev => ({ ...prev, errMsg: '' }))
		if (isInputEmail) {
			setIsInputEmail(false)
			return true
		}

		if (!isSubmitted) {
			setIsSubmitted(true)
			RunAfterSomeTime(() => {
				try {
					// TODO: fetch access token to custom authentication backend api
					throw new Error(
						// '[TEST]: There is no Vercel account associated with this email address. Sign up?'
						'[TEST]: An error has occurred. E-mail or Password is incorrect. Try again'
					)

					updateAuthCb({ ...inputStates, accessToken: '' })
					setLoginStatus({ success: true, errMsg: '' })
					resetInputState()

					setIsSubmitted(false)
				} catch (error) {
					setIsSubmitted(false)
					setLoginStatus({ success: false, errMsg: CreateErrorObj(error) })
					return false
				}
			}, 3)
		}

		return true
	}

	const handleChangeEmail = () => {
		resetInputState('password')
		setIsInputEmail(true)
	}

	const isMinLength = minLength.test(password)
	const isValidEmail = REGISTER_STATE.EMAIL_REGEX.test(email)

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
			<RotatingBackdrop />
			<div className={container}>
				{success ? (
					<Header>
						<h1>
							You are logged in! <i className="fa fa-check-circle scaleup" />
						</h1>
						<LinkLabel
							linkRef={vaultLinkRef}
							routeTo="/secure-vault"
							preText="Proceed to your secured"
						>
							password vault
						</LinkLabel>
					</Header>
				) : (
					<>
						<Header
							title="Welcome back"
							subTitle="Log in or create a new account to access your secured vault"
							status={loginStatus}
						/>

						<form onSubmit={handleSubmit}>
							<div className="input-row">
								{isInputEmail ? (
									<FormInput
										id="email"
										type="text"
										inputMode="email"
										autoComplete="email"
										placeholder="Email"
										required
										value={email}
										linkRef={emailInputRef}
										disabled={!isInputEmail || isSubmitted}
										label="Email Address"
										isFocused={inputFocus.email}
										isValid={isValidEmail && !errMsg}
										validations={!errMsg ? emailValidation : []}
										className={!inputFocus.email && (errMsg || !isValidEmail) ? 'invalid' : ''}
										{...{ onChange, onFocus, onBlur }}
									/>
								) : (
									<>
										<FormInput
											id="password"
											type="password"
											placeholder="Password"
											required
											value={password}
											linkRef={passwordInputRef}
											disabled={isSubmitted}
											label="Master Password"
											isFocused={inputFocus.password}
											isValid={isMinLength && !errMsg}
											validations={!errMsg ? passwordValidation : []}
											className={!inputFocus.password && (errMsg || !isMinLength) ? 'invalid' : ''}
											{...{ onChange, onFocus, onBlur }}
										/>
										{/* <LinkLabel
											routeTo="/reset"
											preText="Forgot master password?"
										>
											Reset
										</LinkLabel> */}
									</>
								)}
							</div>

							<SubmitButton
								iconName={isInputEmail ? '' : 'fa-sign-in'}
								submitted={isSubmitted}
								disabled={
									isSubmitted || (isInputEmail ? !isValidEmail : !(isValidEmail && isMinLength))
								}
								onClick={() => console.log('Submit button triggered!')}
							>
								{isInputEmail ? 'Continue' : 'Log in with Master Password'}
							</SubmitButton>
						</form>

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
							<AuthProviderSection />
						</footer>
					</>
				)}
			</div>
		</section>
	)
}
