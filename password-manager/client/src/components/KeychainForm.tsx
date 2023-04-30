import { FormEvent, useEffect, useRef, useState } from 'react'
import '@/assets/modules/KeychainForm.css'
import {
	FormGroup,
	PasswordStrength,
	SubmitButton,
	AnimatedIcon,
	InlineNotification,
	LinkLabel,
	Header,
	Separator,
} from '@/components'
import { KeychainCard } from '@/components/KeychainCard'
import { useDebounceToggle, useInput, useStateObj, useTimedCopyToClipboard } from '@/hooks'
import {
	CreateError,
	GeneratePassword,
	GenerateUUID,
	IsEmpty,
	MergeRegExObj,
	RunAfterSomeTime,
	TimeAgo,
} from '@/services/Utils/password-manager.helper'
import { REGISTER_STATE, KEYCHAIN_CONST, RequestType } from '@/services/constants'
import type { TFunction, TKeychain, TStatus, TRequestType } from '@/types'

const { PASSWORD_REGEX } = REGISTER_STATE
const { STATUS, KEYCHAIN, WEBSITE_REGEX } = KEYCHAIN_CONST
const { add, modify, remove } = RequestType

interface INewKeychainForm {
	showForm: TFunction<boolean>
	keychainInfo?: Partial<TKeychain>
	updateCallback: TFunction<[keychainInfo: TKeychain, requestType: TRequestType], Promise<TStatus>>
}
export function KeychainForm({ showForm, keychainInfo, updateCallback }: INewKeychainForm) {
	// form controlled inputs
	const { inputAttribute, inputAction } = useInput<TKeychain>(KEYCHAIN)
	// destructure
	const { inputStates, onChange, onFocus, onBlur, isSubmitted, isFocus } = inputAttribute
	const { website, username, password } = inputStates

	const websiteInputRef = useRef<HTMLInputElement>(null)
	const initInputActionRef = useRef(true)
	const [revealPassword, setRevealPassword] = useState(false)
	const { objState: keychainStatus, mutate: updateKeychainStatus } = useStateObj<TStatus>(STATUS)

	const usernameClipboard = useTimedCopyToClipboard({})
	const passwordClipboard = useTimedCopyToClipboard({})

	// conditional rendering
	const checkIf = {
		isEditing: !IsEmpty(keychainInfo?.keychainId),
		isClipboardTriggered: usernameClipboard.isCopied || passwordClipboard.isCopied,
		isValidWebsite: WEBSITE_REGEX.test(website),
		canCopyUsername: !usernameClipboard.isCopied && !IsEmpty(username),
		canCopyPassword: !passwordClipboard.isCopied && !IsEmpty(password),
		canGeneratePassword: !isSubmitted && !keychainStatus.success,
		debounceUsernameClipboard:
			useDebounceToggle(usernameClipboard.isCopied, 2) &&
			usernameClipboard.isCopied &&
			!IsEmpty(username),
		debouncePasswordClipboard:
			useDebounceToggle(passwordClipboard.isCopied, 2) &&
			passwordClipboard.isCopied &&
			!IsEmpty(password),
		canDisableSubmit() {
			return (
				isSubmitted ||
				keychainStatus.success ||
				!checkIf.isValidWebsite ||
				IsEmpty(username) ||
				IsEmpty(password)
			)
		},
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
				passwordClipboard.copy(password)
			}
		},
		copyUserName: () => {
			if (checkIf.canCopyUsername) {
				passwordClipboard.clear()
				usernameClipboard.copy(username)
			}
		},
		revealPassword: () => {
			if (password) {
				setRevealPassword(prev => !prev)
			}
		},
		deletePassword: async () => {
			if (checkIf.canGeneratePassword) {
				// post request to remove keychain info
				const { success, message } = await updateCallback({ ...inputStates }, remove)
				if (!success) throw new Error(message)

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
				// set to submit and reset status
				inputAction.isSubmit(true)
				updateKeychainStatus(STATUS)

				try {
					// post request to update/add keychain info
					const { success, message } = await updateCallback(
						{ ...inputStates },
						checkIf.isEditing ? modify : add
					)
					if (!success) throw new Error(message)

					const successMessage = checkIf.isEditing
						? 'The changes have been saved'
						: 'Password have been added!'
					// show success status before closing the modal
					updateKeychainStatus({ success: true, message: successMessage })

					// after sometime, reset status and close modal
					RunAfterSomeTime(() => {
						updateKeychainStatus(STATUS)
						showForm(false)
						// invoke resetInput
						inputAction.resetInput()
					}, 3)
				} catch (error) {
					updateKeychainStatus({ success: false, message: CreateError(error).message })
				} finally {
					inputAction.isSubmit(false)
				}
			}
		},
	}

	return (
		<>
			<Header>
				<Header.Logo>{checkIf.isEditing ? 'Edit Password' : 'Add Password'}</Header.Logo>

				{!checkIf.isEditing && (
					<Header.Title subTitle="We will save this password in your session storage and cloud account" />
				)}

				<Header.Status status={keychainStatus} />
			</Header>

			{checkIf.isEditing && (
				<>
					<KeychainCard
						logo={keychainInfo?.logo}
						website={keychainInfo?.website}
						className="keychain-item card-header"
						subText={`Last modified ${TimeAgo(new Date(keychainInfo?.timeAgo ?? ''))}`}
					>
						<LinkLabel
							preText=""
							routeTo="/vault"
							onClick={handleAction.deletePassword}
						>
							<AnimatedIcon
								className={`regular ${isSubmitted || keychainStatus.success ? 'disabled' : 'active'
									}`}
								iconName="fa fa-trash"
								animation="fa-shake danger"
							/>
						</LinkLabel>
					</KeychainCard>
					<Separator />
				</>
			)}

			<FormGroup onSubmit={handleAction.submitForm}>
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
							inputMode="url"
							placeholder="ex: outlook.com"
							linkRef={websiteInputRef}
							value={website}
							disabled={isSubmitted}
							required
							className={`${isSubmitted
									? 'disabled'
									: checkIf.isValidWebsite
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
							isFulfilled: !IsEmpty(username),
						}}
					/>
					<FormGroup.Input
						id="username"
						type="text"
						placeholder="ex: sample@email.com"
						value={username}
						disabled={isSubmitted}
						required
						className={`${isSubmitted ? 'disabled' : !IsEmpty(username) ? '' : !isFocus.username && 'invalid'
							}`}
						{...{ onChange, onFocus, onBlur }}
					/>
					<div className="action-container">
						{username.length > 0 && (
							<AnimatedIcon
								title="Copy"
								className={`action-button small ${checkIf.canCopyUsername && 'active scale-down'}`}
								iconName={`fa ${checkIf.debounceUsernameClipboard ? 'fa-check active scale-up' : 'fa-clone'
									}`}
								onClick={handleAction.copyUserName}
							/>
						)}
					</div>
				</div>

				<div className="input-row vr">
					<FormGroup.Label
						props={{
							label: 'Password',
							labelFor: 'password',
							isFulfilled: !IsEmpty(password),
						}}
					>
						<PasswordStrength
							password={password}
							regex={MergeRegExObj(PASSWORD_REGEX)}
						/>
					</FormGroup.Label>
					<FormGroup.Input
						id="password"
						style={{ paddingRight: '106px' }}
						type={revealPassword ? 'text' : 'password'}
						value={password}
						disabled={isSubmitted}
						required
						className={`${isSubmitted ? 'disabled' : !IsEmpty(password) ? '' : !isFocus.password && 'invalid'
							}`}
						{...{ onChange, onFocus, onBlur }}
					/>

					<div className="action-container">
						{password.length > 0 && (
							<>
								<AnimatedIcon
									title={revealPassword ? 'hide' : 'reveal'}
									className={`action-button small ${password.length > 0 && 'active'}`}
									iconName={`fa fa-eye${revealPassword ? '-slash scale-up' : ' scale-down'}`}
									onClick={handleAction.revealPassword}
								/>
								<AnimatedIcon
									title="Copy"
									className={`action-button small ${checkIf.canCopyPassword && 'active scale-down'
										}`}
									iconName={`fa ${checkIf.debouncePasswordClipboard ? 'fa-check active scale-up' : 'fa-clone'
										}`}
									onClick={handleAction.copyPassword}
								/>
							</>
						)}
						<AnimatedIcon
							title="generate password"
							className={`action-button small ${checkIf.canGeneratePassword && 'active'}`}
							iconName="fa fa-refresh"
							animation="fa-spin"
							onClick={handleAction.generatePassword}
						/>
					</div>
					<div>
						{checkIf.isClipboardTriggered && (
							<InlineNotification
								className="lit-info"
								offsetYPos="98%"
								iconName="fa-solid fa-triangle-exclamation"
							>
								{usernameClipboard.isCopied
									? usernameClipboard.statusMessage
									: passwordClipboard.statusMessage}
							</InlineNotification>
						)}
					</div>
				</div>

				<div>
					<p className="center small descend">
						Adding the password here saves it only to your registered account. Make sure the
						password you save here matches your password for the website.
					</p>
				</div>

				<div className="center">
					<SubmitButton
						props={{
							variant: 'cancel',
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
