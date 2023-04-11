import '@/assets/modules/NewKeychainForm.css'
import { FormEvent, useEffect, useRef, useState } from 'react'
import {
	Header,
	FormGroup,
	PasswordStrength,
	SubmitButton,
	AnimatedIcon,
	InlineNotification,
	KeychainCard,
} from '.'
import { useDebounceToggle, useInput, useTimedCopyToClipboard } from '@/hooks'
import { TFunction, TKeychain, TStatus } from '@/types'
import {
	CreateError,
	GeneratePassword,
	GenerateUUID,
	MergeRegExObj,
	RunAfterSomeTime,
} from '@/services/Utils/password-manager.helper'
import { REGISTER_STATE, KEYCHAIN_CONST } from '@/services/constants'
import { Link } from 'react-router-dom'

interface INewKeychainForm {
	showForm: TFunction<boolean>
	keychainInfo?: Partial<TKeychain>
}
const { PASSWORD_REGEX } = REGISTER_STATE
const { STATUS, KEYCHAIN, WEBSITE_REGEX } = KEYCHAIN_CONST

export function NewKeychainForm({ showForm, keychainInfo }: INewKeychainForm) {
	// form controlled inputs
	const { inputAttribute, inputAction } = useInput<TKeychain>(KEYCHAIN)
	// destructure
	const { inputStates, onChange, onFocus, onBlur, isSubmitted } = inputAttribute
	const { website, username, password } = inputStates

	const [revealPassword, setRevealPassword] = useState(false)
	const [keychainStatus, setKeychainStatus] = useState<TStatus>(STATUS)
	const usernameClipboard = useTimedCopyToClipboard({
		text: username,
		message: 'User Name copied!',
		callbackFn: () => setKeychainStatus(STATUS),
	})
	const passwordClipboard = useTimedCopyToClipboard({
		text: password,
		message: 'Password copied!',
		callbackFn: () => setKeychainStatus(STATUS),
	})
	const debounceCopyUserName = useDebounceToggle(usernameClipboard.isCopied, 2)
	const debounceCopyPassword = useDebounceToggle(passwordClipboard.isCopied, 2)

	const websiteInputRef = useRef<HTMLInputElement>(null)
	const initInputActionRef = useRef(true)

	useEffect(() => {
		if (initInputActionRef.current) {
			inputAction.mutate({
				...keychainInfo,
				keychainId: keychainInfo?.keychainId ? keychainInfo.keychainId : GenerateUUID(),
				password: keychainInfo?.password ? keychainInfo.password : GeneratePassword(),
			})
			initInputActionRef.current = false
		}
	}, [inputAction, keychainInfo])

	useEffect(() => {
		if (!keychainStatus.success) websiteInputRef.current?.focus()
	}, [keychainStatus.success])

	const submitKeychainForm = async (e: FormEvent) => {
		e.preventDefault()

		if (!isSubmitted) {
			inputAction.submit(true)
			// clear the status before proceed
			setKeychainStatus(STATUS)
			inputAction.mutate({
				// get the logo from website
				// logo: await GetLogoUrlAsync(website),
			})

			try {
				// simulate api post request
				RunAfterSomeTime(() => {
					inputAction.submit(false)
					setKeychainStatus({ success: true, message: 'The changes have been saved' })

					// after sometime, reset status and close modal
					RunAfterSomeTime(() => {
						setKeychainStatus(STATUS)
						showForm(false)
						// invoke resetInput
						// inputAction.resetInput()
					}, 3)
				}, 3)
			} catch (error) {
				setKeychainStatus({ success: false, message: CreateError(error).message })
			}
		}
	}

	// conditional rendering
	const checkIf = {
		isValidWebsite: WEBSITE_REGEX.test(website),
		isValidUsernameLength: username.trim().length > 2 ? true : false,
		isValidPasswordLength: password.length > 2 ? true : false,
		isEditing: Object.values(keychainInfo || {}).some(Boolean),
		isClipboardTriggered: usernameClipboard.isCopied || passwordClipboard.isCopied,
		canDisableSubmit:
			isSubmitted ||
			keychainStatus.success ||
			!WEBSITE_REGEX.test(website) ||
			!username ||
			!password,
		canCopyUsername: !usernameClipboard.isCopied && username.length > 0,
		canCopyPassword: !passwordClipboard.isCopied && password.length > 0,
		canUpdatePassword: !isSubmitted && !keychainStatus.success,
		debounceUsernameClipboard:
			debounceCopyUserName && usernameClipboard.isCopied && username.length > 0,
		debouncePasswordClipboard:
			debounceCopyPassword && passwordClipboard.isCopied && password.length > 0,
	}

	const handleAction = {
		generatePassword: () => {
			if (!isSubmitted) {
				passwordClipboard.clear()
				setRevealPassword(true)
				inputAction.mutate({ password: GeneratePassword() })
			}
		},
		copyPassword: () => {
			if (checkIf.canCopyPassword) {
				usernameClipboard.clear()
				passwordClipboard.copy()
			}
		},
		copyUserName: () => {
			if (checkIf.canCopyUsername) {
				passwordClipboard.clear()
				usernameClipboard.copy()
			}
		},
		revealPassword: () => {
			if (password) {
				setRevealPassword(prev => !prev)
			}
		},
		deletePassword: () => {
			if (checkIf.canUpdatePassword) {
				setKeychainStatus({ success: false, message: '[Not implemented]' })

				RunAfterSomeTime(() => setKeychainStatus({ success: false, message: '' }), 5)
			}
		},
	}

	return (
		<>
			<Header>
				{!checkIf.isEditing ? (
					<>
						<Header.Title
							title="Add Password"
							subTitle="We will save this password in your session storage and cloud account"
						/>
						<Header.Status status={keychainStatus} />
					</>
				) : (
					<>
						<Header.Title
							title="Edit Password"
							subTitle=""
						/>

						<Header.Status status={keychainStatus} />

						<KeychainCard
							logo={keychainInfo?.logo}
							website={keychainInfo?.website}
						>
							<Link
								to="/keychain"
								title="Delete"
								className="menu descend"
								onClick={handleAction.deletePassword}
							>
								<AnimatedIcon
									className={`regular ${isSubmitted || keychainStatus.success ? 'disabled' : ''}`}
									iconName="fa fa-trash"
									animation="fa-shake danger"
								/>
							</Link>
						</KeychainCard>
					</>
				)}
			</Header>

			<FormGroup onSubmit={submitKeychainForm}>
				{!checkIf.isEditing && (
					<div className="input-row">
						<FormGroup.Label
							props={{
								label: 'Website',
								labelFor: 'website',
								isFulfilled: checkIf.isValidWebsite,
							}}
						/>
						<FormGroup.Input
							id="website"
							type="text"
							placeholder="ex: outlook.com"
							linkRef={websiteInputRef}
							value={website}
							disabled={isSubmitted}
							required
							className={`${
								isSubmitted ? 'disabled' : checkIf.isValidWebsite ? 'valid' : 'invalid'
							}`}
							{...{ onChange, onFocus, onBlur }}
						/>
					</div>
				)}

				<div className="input-row">
					<FormGroup.Label
						props={{
							label: 'User Name',
							labelFor: 'username',
							isFulfilled: checkIf.isValidUsernameLength,
						}}
					/>
					<FormGroup.Input
						id="username"
						type="text"
						placeholder="ex: sample@email.com"
						value={username}
						disabled={isSubmitted}
						required
						className={`${
							isSubmitted ? 'disabled' : checkIf.isValidUsernameLength ? 'valid' : 'invalid'
						}`}
						{...{ onChange, onFocus, onBlur }}
					/>
					<div className="action-container">
						<AnimatedIcon
							className={`action-button small ${checkIf.canCopyUsername && 'active'}`}
							iconName={`fa ${checkIf.debounceUsernameClipboard ? 'fa-check' : 'fa-clone'}`}
							onClick={handleAction.copyUserName}
						/>
					</div>
				</div>

				<div className="input-row vr">
					<FormGroup.Label
						props={{
							label: 'Password',
							labelFor: 'password',
							isFulfilled: checkIf.isValidPasswordLength,
						}}
					>
						<PasswordStrength
							password={password}
							regex={MergeRegExObj(PASSWORD_REGEX)}
						/>
					</FormGroup.Label>
					<div>
						<FormGroup.Input
							id="password"
							style={{ paddingRight: '106px' }}
							type={revealPassword ? 'text' : 'password'}
							value={password}
							disabled={isSubmitted}
							required
							className={`${
								isSubmitted ? 'disabled' : checkIf.isValidPasswordLength ? 'valid' : 'invalid'
							}`}
							{...{ onChange, onFocus, onBlur }}
						/>

						<div className="action-container">
							<AnimatedIcon
								className={`action-button small ${password && 'active'}`}
								iconName={`fa fa-eye${revealPassword ? '-slash' : ''}`}
								onClick={handleAction.revealPassword}
							/>
							<AnimatedIcon
								className={`action-button small ${checkIf.canUpdatePassword && 'active'}`}
								iconName="fa fa-refresh"
								animation="fa-spin"
								onClick={handleAction.generatePassword}
							/>
							<AnimatedIcon
								className={`action-button small ${checkIf.canCopyPassword && 'active'}`}
								iconName={`fa ${checkIf.debouncePasswordClipboard ? 'fa-check' : 'fa-clone'}`}
								onClick={handleAction.copyPassword}
							/>
						</div>

						<p className="center small descend">
							Adding the password here saves it only to your registered account. Make sure the
							password you save here matches your password for the website.
						</p>
						{checkIf.isClipboardTriggered && (
							<InlineNotification>
								{usernameClipboard.isCopied
									? usernameClipboard.statusMessage
									: passwordClipboard.statusMessage}
							</InlineNotification>
						)}
					</div>
				</div>

				<div className="center">
					<SubmitButton
						props={{
							variant: 'cancel',
							submitted: false,
							disabled: isSubmitted,
						}}
						onClick={() => {
							setRevealPassword(false)
							showForm(false)
							setKeychainStatus({ success: false, message: '' })
						}}
					>
						Cancel
					</SubmitButton>

					<SubmitButton
						props={{
							variant: 'primary',
							textStatus: 'Saving',
							submitted: isSubmitted,
							disabled: checkIf.canDisableSubmit,
						}}
					>
						{checkIf.isEditing ? 'Done' : 'Add Password'}
					</SubmitButton>
				</div>
			</FormGroup>
		</>
	)
}
