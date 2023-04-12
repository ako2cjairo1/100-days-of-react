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
import { useDebounceToggle, useInput, useStateObj, useTimedCopyToClipboard } from '@/hooks'
import { TFunction, TKeychain, TStatus, TRequestType } from '@/types'
import {
	CreateError,
	GeneratePassword,
	GenerateUUID,
	MergeRegExObj,
	RunAfterSomeTime,
} from '@/services/Utils/password-manager.helper'
import { REGISTER_STATE, KEYCHAIN_CONST, RequestType } from '@/services/constants'
import { Link } from 'react-router-dom'

const { PASSWORD_REGEX } = REGISTER_STATE
const { STATUS, KEYCHAIN, WEBSITE_REGEX } = KEYCHAIN_CONST
const { add, modify, remove } = RequestType

interface INewKeychainForm {
	showForm: TFunction<boolean>
	keychainInfo?: Partial<TKeychain>
	updateCallback: TFunction<[keychainInfo: TKeychain, requestType: TRequestType], TStatus>
}
export function KeychainForm({ showForm, keychainInfo, updateCallback }: INewKeychainForm) {
	// form controlled inputs
	const { inputAttribute, inputAction } = useInput<TKeychain>(KEYCHAIN)
	// destructure
	const { inputStates, onChange, onFocus, onBlur, isSubmitted, isFocus } = inputAttribute
	const { website, username, password } = inputStates

	const [revealPassword, setRevealPassword] = useState(false)
	const { objState: keychainStatus, mutate: updateKeychainStatus } = useStateObj<TStatus>(STATUS)
	const usernameClipboard = useTimedCopyToClipboard({
		text: username,
		message: 'User Name copied!',
		callbackFn: () => updateKeychainStatus(STATUS),
	})
	const passwordClipboard = useTimedCopyToClipboard({
		text: password,
		message: 'Password copied!',
		callbackFn: () => updateKeychainStatus(STATUS),
	})
	const debounceCopyUserName = useDebounceToggle(usernameClipboard.isCopied, 2)
	const debounceCopyPassword = useDebounceToggle(passwordClipboard.isCopied, 2)

	const websiteInputRef = useRef<HTMLInputElement>(null)
	const initInputActionRef = useRef(true)

	// conditional rendering
	const checkIf = {
		isValidWebsite: () => WEBSITE_REGEX.test(website),
		isValidUsernameLength: username.trim().length > 2 ? true : false,
		isValidPasswordLength: password.length > 2 ? true : false,
		isEditing: Object.values(keychainInfo || {}).some(Boolean),
		isClipboardTriggered: usernameClipboard.isCopied || passwordClipboard.isCopied,
		canDisableSubmit: () =>
			isSubmitted ||
			keychainStatus.success ||
			!checkIf.isValidWebsite ||
			!checkIf.isValidUsernameLength ||
			!checkIf.isValidPasswordLength,
		canCopyUsername: !usernameClipboard.isCopied && username.length > 0,
		canCopyPassword: !passwordClipboard.isCopied && password.length > 0,
		canUpdatePassword: !isSubmitted && !keychainStatus.success,
		debounceUsernameClipboard:
			debounceCopyUserName && usernameClipboard.isCopied && username.length > 0,
		debouncePasswordClipboard:
			debounceCopyPassword && passwordClipboard.isCopied && password.length > 0,
	}

	useEffect(() => {
		// on initial render, determine if we need to generate new UUI and password
		if (initInputActionRef.current) {
			inputAction.mutate({
				...keychainInfo,
				keychainId: checkIf.isEditing ? keychainInfo?.keychainId : GenerateUUID(),
				password: checkIf.isEditing ? keychainInfo?.password : GeneratePassword(),
			})
			initInputActionRef.current = false
		}
	}, [checkIf.isEditing, inputAction, keychainInfo])

	useEffect(() => {
		// focus the cursor to input Website
		if (!keychainStatus.success) websiteInputRef.current?.focus()
	}, [keychainStatus.success])

	useEffect(() => {
		// clear the status message when user is updating the form
		updateKeychainStatus({ message: '' })
	}, [inputStates, updateKeychainStatus])

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
				const update = updateCallback(inputStates, remove)
				if (!update.success) {
					return updateKeychainStatus(update)
				}

				// RunAfterSomeTime(() => setKeychainStatus({ success: false, message: '' }), 5)
				// show success status before closing the modal
				updateKeychainStatus({ success: true, message: 'Password Deleted!' })

				// after sometime, reset status and close modal
				RunAfterSomeTime(() => {
					updateKeychainStatus(STATUS)
					showForm(false)
					// invoke resetInput
					inputAction.resetInput()
				}, 3)
			}
		},
		submitForm: async (e: FormEvent) => {
			e.preventDefault()

			if (!isSubmitted) {
				inputAction.submit(true)
				// clear the status before proceed
				updateKeychainStatus(STATUS)

				try {
					// simulate api post request to update/add the keychain info
					RunAfterSomeTime(() => {
						inputAction.submit(false)
						const update = updateCallback(inputStates, checkIf.isEditing ? modify : add)

						if (!update.success) {
							return updateKeychainStatus(update)
						}

						// show success status before closing the modal
						updateKeychainStatus({ success: true, message: 'The changes have been saved' })

						// after sometime, reset status and close modal
						RunAfterSomeTime(() => {
							updateKeychainStatus(STATUS)
							showForm(false)
							// invoke resetInput
							inputAction.resetInput()
						}, 3)
					}, 3)
				} catch (error) {
					updateKeychainStatus({ success: false, message: CreateError(error).message })
				}
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
								to="/vault"
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

			<FormGroup onSubmit={handleAction.submitForm}>
				{!checkIf.isEditing && (
					<div className="input-row">
						<FormGroup.Label
							props={{
								label: 'Website',
								labelFor: 'website',
								isFulfilled: checkIf.isValidWebsite(),
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
								isSubmitted
									? 'disabled'
									: checkIf.isValidWebsite()
									? ''
									: !isFocus.website && 'invalid'
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
							isSubmitted
								? 'disabled'
								: checkIf.isValidUsernameLength
								? ''
								: !isFocus.username && 'invalid'
						}`}
						{...{ onChange, onFocus, onBlur }}
					/>
					<div className="action-container">
						<AnimatedIcon
							className={`action-button small ${checkIf.canCopyUsername && 'active'}`}
							iconName={`fa ${
								checkIf.debounceUsernameClipboard ? 'fa-check scale-up' : 'fa-clone'
							}`}
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
								isSubmitted
									? 'disabled'
									: checkIf.isValidPasswordLength
									? ''
									: !isFocus.password && 'invalid'
							}`}
							{...{ onChange, onFocus, onBlur }}
						/>

						<div className="action-container">
							<AnimatedIcon
								className={`action-button small ${password && 'active'}`}
								iconName={`fa fa-eye${revealPassword ? '-slash scale-up' : ' scale-down'}`}
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
								iconName={`fa ${
									checkIf.debouncePasswordClipboard ? 'fa-check scale-up' : 'fa-clone'
								}`}
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
							updateKeychainStatus({ success: false, message: '' })
						}}
					>
						Cancel
					</SubmitButton>

					<SubmitButton
						props={{
							variant: 'primary',
							textStatus: 'Saving',
							submitted: isSubmitted,
							disabled: checkIf.canDisableSubmit(),
						}}
					>
						{checkIf.isEditing ? 'Save' : 'Add Password'}
					</SubmitButton>
				</div>
			</FormGroup>
		</>
	)
}
