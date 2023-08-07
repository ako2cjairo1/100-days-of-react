import { FormEvent, useEffect, useRef, useState } from 'react'
import '@/assets/modules/Login.css'
import type { TStatus, TInputRegistration, TValidation } from '@/types'
import { REGISTER_STATE } from '@/services/constants'
import {
	RunAfterSomeTime,
	ExtractValFromRegEx,
	MergeRegExObj,
	CreateError,
	IsEmpty,
	hashPassword,
} from '@/services/Utils'
import {
	LinkLabel,
	Separator,
	AuthProviderSection,
	SubmitButton,
	Toggle,
	FormGroup,
	ValidationMessage,
	PasswordStrength,
	AnimatedIcon,
	Header,
	BusyIndicator,
} from '@/components'
import { useInput, useAuthContext, useStateObj } from '@/hooks'
import { registerUserService, ssoService } from '@/services/api'

// constants
const { CREDENTIALS, STATUS, EMAIL_REGEX, PASSWORD_REGEX } = REGISTER_STATE
const { alphabet, minLength, number, symbol } = PASSWORD_REGEX

export function Registration() {
	// form controlled inputs
	const { isSubmit, resetInput, input, onChange, onFocus, onBlur, isFocus, isSubmitted } =
		useInput<TInputRegistration>(CREDENTIALS)

	const { objState: registrationStatus, mutate: updateRegistrationStatus } =
		useStateObj<TStatus>(STATUS)
	const updateRegistrationStatusRef = useRef(updateRegistrationStatus)

	const emailRef = useRef<HTMLInputElement>(null)
	const loginRef = useRef<HTMLAnchorElement>(null)
	const { mutateAuth } = useAuthContext()
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (!registrationStatus.success) emailRef.current?.focus()
		else loginRef.current?.focus()
	}, [registrationStatus.success])

	useEffect(() => {
		updateRegistrationStatusRef.current({ message: '' })
	}, [input])

	const passwordRequirement = {
		minLength: minLength.test(input.password),
		alphabet: alphabet.test(input.password),
		number: number.test(input.password),
		symbol: symbol.test(input.password),
		illegalSymbol: !input.password.includes(','),
	}

	const checkIf = {
		isValidEmail: EMAIL_REGEX.test(input.email),
		isValidPassword: Object.values(passwordRequirement).every(Boolean),
		validConfirmation: !IsEmpty(input.password) && input.password === input.confirm,
		canSubmitForm() {
			return (
				!input.isTermsAgreed ||
				isSubmitted ||
				!checkIf.isValidEmail ||
				!checkIf.isValidPassword ||
				input.password !== input.confirm
			)
		},
	}

	const { emailReq, passwordReq, confirmReq } = {
		emailReq: [{ isValid: checkIf.isValidEmail, message: 'Input is not a valid email address.' }],
		passwordReq: [
			{
				isValid: passwordRequirement.alphabet,
				message: 'an upper and a lower case letter',
			},
			{
				isValid: passwordRequirement.number,
				message: 'a number',
			},
			{
				isValid: passwordRequirement.minLength,
				message: `at least ${ExtractValFromRegEx(minLength.source)} characters`,
			},
			{
				isValid: passwordRequirement.symbol,
				message: `a special character: ${ExtractValFromRegEx(symbol.source)}`,
			},
			{
				isValid: passwordRequirement.illegalSymbol,
				message: 'does not contain illegal symbol: comma (,)',
			},
		] satisfies TValidation[],
		confirmReq: [
			{
				isValid: checkIf.validConfirmation,
				message: 'Master password confirmation does not match.',
			},
		],
	}

	const handleSubmit = async (event: FormEvent) => {
		event.preventDefault()

		if (!isSubmitted) {
			updateRegistrationStatus({ message: '' })
			isSubmit(true)

			RunAfterSomeTime(async () => {
				try {
					if (checkIf.isValidPassword) {
						// register and get accessToken, encrypted vault and salt from API
						await registerUserService({
							email: input.email,
							// hash password before sending to API
							password: hashPassword(input.password),
						})
						// !This maybe replaced with cookies
						mutateAuth({ email: input.email })
						// clear form input states and status
						resetInput()
						updateRegistrationStatus({ success: true, message: '' })
					} else {
						updateRegistrationStatus({
							success: false,
							message: 'Registration Failed!',
						})
					}

					isSubmit(false)
				} catch (error) {
					isSubmit(false)
					return updateRegistrationStatus({ success: false, message: CreateError(error).message })
				}
			}, 3)
		}
	}

	// process indicator while doing oAuth
	if (loading)
		return (
			<BusyIndicator
				title="Please wait..."
				subTitle={registrationStatus.message}
			/>
		)

	// success registration indicator
	if (registrationStatus.success)
		return (
			<div className="form-container">
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
			</div>
		)

	return (
		<section className="form-container">
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
							isFulfilled: checkIf.isValidEmail,
						}}
					/>
					<FormGroup.Input
						id="email"
						type="email"
						inputMode="email"
						autoComplete="email"
						autoCapitalize="none"
						placeholder="sample@email.com"
						value={input.email}
						linkRef={emailRef}
						disabled={isSubmitted}
						required
						{...{ onChange, onFocus, onBlur }}
						className={
							isFocus.email
								? ''
								: checkIf.isValidEmail
								? 'valid'
								: !IsEmpty(input.email)
								? 'invalid'
								: ''
						}
					/>
					<ValidationMessage
						isVisible={!isFocus.email && !checkIf.isValidEmail && !IsEmpty(input.email)}
						validations={emailReq}
					/>
				</div>

				<div className="input-row">
					<FormGroup.Label
						props={{
							label: 'Master Password',
							labelFor: 'password',
							isFulfilled: checkIf.isValidPassword,
						}}
					>
						<PasswordStrength
							password={input.password}
							regex={MergeRegExObj(PASSWORD_REGEX)}
						/>
					</FormGroup.Label>
					<FormGroup.Input
						id="password"
						type="password"
						placeholder="Enter Master Password"
						value={input.password}
						disabled={isSubmitted}
						required
						{...{ onChange, onFocus, onBlur }}
						className={
							isFocus.password
								? ''
								: checkIf.isValidPassword
								? 'valid'
								: !IsEmpty(input.password)
								? 'invalid'
								: ''
						}
					/>
					<ValidationMessage
						title="Your master password must contain:"
						isVisible={!isFocus.password && !checkIf.isValidPassword && !IsEmpty(input.password)}
						validations={passwordReq}
					/>
				</div>

				<div className="input-row vr">
					<FormGroup.Label
						props={{
							label: 'Confirm Master Password',
							labelFor: 'confirm',
							isFulfilled: checkIf.validConfirmation,
						}}
					/>

					<FormGroup.Input
						id="confirm"
						type="password"
						placeholder="Confirm Your Master Password"
						value={input.confirm}
						disabled={isSubmitted}
						required
						{...{ onChange, onFocus, onBlur }}
						className={
							isFocus.confirm
								? ''
								: checkIf.validConfirmation
								? 'valid'
								: !IsEmpty(input.password)
								? 'invalid'
								: ''
						}
					/>

					<ValidationMessage
						isVisible={!isFocus.confirm && !checkIf.validConfirmation && !IsEmpty(input.confirm)}
						validations={confirmReq}
					/>
				</div>

				<Toggle
					id="isTermsAgreed"
					checked={input.isTermsAgreed}
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

				<div className="center">
					<SubmitButton
						props={{
							variant: 'primary',
							iconName: 'fa fa-user-plus',
							textStatus: 'Processing...',
							submitted: isSubmitted,
							disabled: checkIf.canSubmitForm(),
						}}
						className="accent-bg"
					>
						Create account
					</SubmitButton>
				</div>
			</FormGroup>

			<LinkLabel
				routeTo="/login"
				preText="Already have an account?"
			>
				Log in
			</LinkLabel>

			<div>
				<Separator>OR</Separator>
				<p className="center small">you can sign in with...</p>
			</div>

			<footer>
				<AuthProviderSection
					callbackFn={provider => {
						setLoading(true)
						updateRegistrationStatus({ message: `Register and Sign-in via ${provider}` })

						RunAfterSomeTime(() => {
							if (!loading) {
								setLoading(false)
								updateRegistrationStatus({
									success: false,
									message: `${provider} didn't respond, please try again`,
								})
								window.location.reload()
							}
						}, 5)

						// call sso, expect callback from provider on side-effects (Login render)
						ssoService(provider)
					}}
				/>
			</footer>
		</section>
	)
}
