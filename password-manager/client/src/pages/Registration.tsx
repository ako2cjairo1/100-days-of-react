import { FormEvent, useEffect, useRef } from 'react'
import '@/assets/modules/Login.css'
import { TStatus, TInputRegistration } from '@/types/global.type'
import { REGISTER_STATE } from '@/services/constants/Registration.constant'
import {
	RunAfterSomeTime,
	ExtractValFromRegEx,
	MergeRegExObj,
} from '@/services/Utils/password-manager.helper'
import { useInput, useAuthContext, useStateObj } from '@/hooks'
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

// constants
const { CREDENTIALS, STATUS, EMAIL_REGEX, PASSWORD_REGEX } = REGISTER_STATE
const { alphabet, minLength, number, symbol } = PASSWORD_REGEX

export const Registration = () => {
	// form controlled inputs
	const { inputAttribute, inputAction } = useInput<TInputRegistration>(CREDENTIALS)
	// destructure
	const { inputStates, onChange, onFocus, onBlur, isFocus, isSubmitted } = inputAttribute
	const { password, email, confirm, isTermsAgreed } = inputStates

	const { objState: registrationStatus, mutate: mutateRegistrationStatus } =
		useStateObj<TStatus>(STATUS)

	const emailRef = useRef<HTMLInputElement>(null)
	const loginRef = useRef<HTMLAnchorElement>(null)
	const { mutateAuth } = useAuthContext()

	useEffect(() => {
		if (!registrationStatus.success) emailRef.current?.focus()
		else loginRef.current?.focus()
	}, [registrationStatus.success])

	useEffect(() => {
		mutateRegistrationStatus({ message: '' })
	}, [inputStates, mutateRegistrationStatus])

	const passwordRequirement = {
		minLength: minLength.test(password),
		alphabet: alphabet.test(password),
		number: number.test(password),
		symbol: symbol.test(password),
	}

	const checkIf = {
		isValidEmail: EMAIL_REGEX.test(email),
		isValidPassword: Object.values(passwordRequirement).every(Boolean),
		validConfirmation: password === confirm && Object.values(passwordRequirement).every(Boolean),
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
		],
		confirmReq: [
			{
				isValid: checkIf.validConfirmation,
				message: 'Master password confirmation does not match.',
			},
		],
	}

	const handleSubmit = async (e: FormEvent) => {
		e.preventDefault()

		if (!isSubmitted) {
			mutateRegistrationStatus({ message: '' })
			inputAction.submit(true)

			RunAfterSomeTime(() => {
				if (!checkIf.isValidPassword) {
					// TODO: use custom API to handle registration
					mutateAuth({ ...inputStates, accessToken: 'fakeToken' })
					inputAction.resetInput()
					mutateRegistrationStatus({ success: true, message: '' })
				} else {
					mutateRegistrationStatus({
						success: false,
						message: 'Registration Failed!',
					})
				}

				inputAction.submit(false)
			}, 3)
		}
	}

	return (
		<section>
			<div className="form-container">
				{registrationStatus.success ? (
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
									value={email}
									linkRef={emailRef}
									disabled={isSubmitted}
									required
									{...{ onChange, onFocus, onBlur }}
									className={
										isFocus.email
											? ''
											: checkIf.isValidEmail
											? 'valid'
											: email.length > 0
											? 'invalid'
											: ''
									}
								/>
								<ValidationMessage
									isVisible={!isFocus.email && !checkIf.isValidEmail && email.length > 0}
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
										password={password}
										regex={MergeRegExObj(PASSWORD_REGEX)}
									/>
								</FormGroup.Label>
								<FormGroup.Input
									id="password"
									type="password"
									placeholder="Enter Master Password"
									value={password}
									disabled={isSubmitted}
									required
									{...{ onChange, onFocus, onBlur }}
									className={
										isFocus.password
											? ''
											: checkIf.isValidPassword
											? 'valid'
											: password.length > 0
											? 'invalid'
											: ''
									}
								/>
								<ValidationMessage
									title="Your master password must contain:"
									isVisible={!isFocus.password && !checkIf.isValidPassword && password.length > 0}
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
									isVisible={!isFocus.confirm && !checkIf.validConfirmation && confirm.length > 0}
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

							<div className="center">
								<SubmitButton
									props={{
										variant: 'primary',
										iconName: 'fa-user-plus',
										textStatus: 'Processing...',
										submitted: isSubmitted,
										disabled:
											!isTermsAgreed ||
											isSubmitted ||
											!checkIf.isValidEmail ||
											!checkIf.isValidPassword ||
											password !== confirm,
									}}
									className="accent-bg"
									onClick={() => console.log('Submit button triggered!')}
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
							<p className="center small">Continue with...</p>
						</div>

						<footer>
							<AuthProviderSection
								cb={() =>
									mutateRegistrationStatus({
										message: 'TODO: Implement external authentication.',
									})
								}
							/>
						</footer>
					</>
				)}
			</div>
		</section>
	)
}
