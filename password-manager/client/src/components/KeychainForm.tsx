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
	ValidationMessage,
} from '@/components'
import { KeychainCard } from '@/components/KeychainCard'
import { useDebounceToggle, useInput, useStateObj, useTimedCopyToClipboard } from '@/hooks'
import {
	CreateError,
	GeneratePassword,
	GenerateUUID,
	GetDomainUrl,
	IsEmpty,
	RunAfterSomeTime,
	TimeAgo,
} from '@/services/Utils/password-manager.helper'
import { KEYCHAIN_CONST, RequestType } from '@/services/constants'
import type { TFunction, TKeychain, TStatus, TRequestType } from '@/types'

const { INIT_STATUS, INIT_KEYCHAIN, WEBSITE_REGEX } = KEYCHAIN_CONST
const { add, modify, remove } = RequestType

interface INewKeychainForm {
	showForm: TFunction<boolean>
	keychainInfo?: Partial<TKeychain>
	updateCallback: TFunction<[keychainInfo: TKeychain, requestType: TRequestType], Promise<TStatus>>
}
export function KeychainForm({ showForm, keychainInfo, updateCallback }: INewKeychainForm) {
	// form controlled inputs
	const {
		mutate: updateInput,
		resetInput,
		isSubmit,
		input,
		onChange,
		onFocus,
		onBlur,
		isSubmitted,
		isFocus,
	} = useInput<TKeychain>(INIT_KEYCHAIN)
	const updateInputRef = useRef(updateInput)

	const websiteInputRef = useRef<HTMLInputElement>(null)
	const [revealPassword, setRevealPassword] = useState(false)
	const { objState: keychainStatus, mutate: updateKeychainStatus } =
		useStateObj<TStatus>(INIT_STATUS)
	const updateKeychainStatusRef = useRef(updateKeychainStatus)

	const usernameClipboard = useTimedCopyToClipboard({ message: 'Username is copied to clipboard!' })
	const passwordClipboard = useTimedCopyToClipboard({ message: 'Password is copied to clipboard!' })

	// conditional rendering properties
	const checkIf = {
		isEditing: !IsEmpty(keychainInfo?.keychainId),
		isClipboardTriggered: usernameClipboard.isCopied || passwordClipboard.isCopied,
		isValidWebsite: WEBSITE_REGEX.test(input.website),
		isValidPassword: !IsEmpty(input.password) && !input.password.includes(','),
		canCopyUsername: !usernameClipboard.isCopied && !IsEmpty(input.username),
		canCopyPassword: !passwordClipboard.isCopied && !IsEmpty(input.password),
		canGeneratePassword: !isSubmitted && !keychainStatus.success,
		debounceUsernameClipboard:
			useDebounceToggle(usernameClipboard.isCopied, 2) &&
			usernameClipboard.isCopied &&
			!IsEmpty(input.username),
		debouncePasswordClipboard:
			useDebounceToggle(passwordClipboard.isCopied, 2) &&
			passwordClipboard.isCopied &&
			!IsEmpty(input.password),
		canDisableSubmit() {
			return (
				isSubmitted ||
				keychainStatus.success ||
				!checkIf.isValidWebsite ||
				!checkIf.isValidPassword ||
				IsEmpty(input.username) ||
				IsEmpty(input.password)
			)
		},
	}

	// on initial render, determine if we need to generate new UUI and password
	useEffect(() => {
		updateInputRef.current({
			...keychainInfo,
			keychainId: checkIf.isEditing ? keychainInfo?.keychainId : GenerateUUID(),
			password: checkIf.isEditing ? keychainInfo?.password : GeneratePassword(),
		})
	}, [checkIf.isEditing, keychainInfo])

	// side-effect to focus the cursor to input Website
	useEffect(() => {
		if (!keychainStatus.success) websiteInputRef.current?.focus()
	}, [keychainStatus.success])

	// side-effect to clear the status message when user updated keychain form
	useEffect(() => {
		updateKeychainStatusRef.current({ message: '' })
	}, [input])

	const handleAction = {
		copyPassword: () => {
			usernameClipboard.clear()
			passwordClipboard.copy(input.password)
		},
		copyUserName: () => {
			passwordClipboard.clear()
			usernameClipboard.copy(input.username)
		},
		revealPassword: () => !IsEmpty(input.password) && setRevealPassword(prev => !prev),
		generatePassword: () => {
			if (!isSubmitted) {
				passwordClipboard.clear()
				setRevealPassword(true)
				updateInput({ password: GeneratePassword() })
			}
		},
		deletePassword: async () => {
			if (checkIf.canGeneratePassword) {
				// post request to remove keychain info
				const { success, message } = await updateCallback({ ...input }, remove)
				if (!success) throw new Error(message)

				// show success status before closing the modal
				updateKeychainStatusRef.current({ success: true, message: 'Password Deleted!' })

				// after sometime, reset status and close modal
				RunAfterSomeTime(() => {
					updateKeychainStatusRef.current(INIT_STATUS)
					showForm(false)
					// invoke resetInput
					resetInput()
				}, 2)
			}
		},
		submitForm: async (e: FormEvent) => {
			e.preventDefault()

			if (!isSubmitted) {
				// set to submit and reset status
				isSubmit(true)
				updateKeychainStatusRef.current(INIT_STATUS)

				try {
					// post request to update/add keychain info
					const { success, message } = await updateCallback(
						// format to correct website url
						{ ...input, website: GetDomainUrl(input.website).url },
						checkIf.isEditing ? modify : add
					)
					if (!success) throw new Error(message)

					const successMessage = checkIf.isEditing
						? 'The changes have been saved'
						: 'Password have been added!'
					// show success status before closing the modal
					updateKeychainStatusRef.current({ success: true, message: successMessage })

					// after sometime, reset status and close modal
					RunAfterSomeTime(() => {
						updateKeychainStatusRef.current(INIT_STATUS)
						showForm(false)
						// invoke resetInput
						resetInput()
					}, 2)
				} catch (error) {
					updateKeychainStatusRef.current({ success: false, message: CreateError(error).message })
				} finally {
					isSubmit(false)
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

				<Header.Status
					status={keychainStatus}
					icon={
						keychainStatus.message.toLowerCase().includes('delete')
							? 'danger fa fa-trash-can fa-bounce'
							: ''
					}
				/>
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
							<div
								className="action-container"
								style={{ position: 'initial' }}
							>
								<AnimatedIcon
									title="Delete Keychain"
									className={`action-button small ${
										isSubmitted || keychainStatus.success ? 'disabled' : 'active'
									}`}
									iconName="fa fa-trash-can"
									animation="fa-shake"
								/>
							</div>
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
							value={input.website}
							disabled={isSubmitted}
							required
							className={`${
								isSubmitted
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
							isFulfilled: !IsEmpty(input.username),
						}}
					/>
					<FormGroup.Input
						id="username"
						type="text"
						placeholder="ex: sample@email.com"
						value={input.username}
						disabled={isSubmitted}
						required
						className={`${
							isSubmitted
								? 'disabled'
								: !IsEmpty(input.username)
								? ''
								: !isFocus.username && 'invalid'
						}`}
						{...{ onChange, onFocus, onBlur }}
					/>
					<div className="action-container">
						{!IsEmpty(input.username) && (
							<AnimatedIcon
								title="Copy"
								className={`action-button small ${checkIf.canCopyUsername && 'active scale-down'}`}
								iconName={`fa ${
									checkIf.debounceUsernameClipboard
										? 'fa-circle-check active scale-up'
										: 'fa-solid fa-copy'
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
							isFulfilled: !IsEmpty(input.password),
						}}
					>
						<PasswordStrength password={input.password} />
					</FormGroup.Label>
					<FormGroup.Input
						id="password"
						style={{ paddingRight: '106px' }}
						type={revealPassword ? 'text' : 'password'}
						placeholder="Secure Password"
						value={input.password}
						disabled={isSubmitted}
						required
						className={`${
							isSubmitted
								? 'disabled'
								: checkIf.isValidPassword
								? ''
								: !isFocus.password && 'invalid'
						}`}
						{...{ onChange, onFocus, onBlur }}
					/>

					<div className="action-container">
						{!IsEmpty(input.password) && (
							<>
								<AnimatedIcon
									title={`${revealPassword ? 'Hide' : 'Reveal'} Password`}
									className={`action-button small ${!IsEmpty(input.password) && 'active'}`}
									iconName={`fa fa-eye${revealPassword ? '-slash scale-up' : ' scale-down'}`}
									onClick={handleAction.revealPassword}
								/>
								<AnimatedIcon
									title="Copy"
									className={`action-button small ${
										checkIf.canCopyPassword && 'active scale-down'
									}`}
									iconName={`fa ${
										checkIf.debouncePasswordClipboard
											? 'fa-circle-check active scale-up'
											: 'fa-solid fa-copy'
									}`}
									onClick={handleAction.copyPassword}
								/>
							</>
						)}
						<AnimatedIcon
							title="Create Strong Password"
							className={`action-button small ${checkIf.canGeneratePassword && 'active'}`}
							iconName="fa fa-refresh"
							animation="fa-spin"
							onClick={handleAction.generatePassword}
						/>
					</div>
					<ValidationMessage
						isVisible={!isFocus.password && !checkIf.isValidPassword && !IsEmpty(input.password)}
						validations={[
							{
								isValid: checkIf.isValidPassword,
								message: 'Password must not contain illegal character(s): ,(comma)',
							},
						]}
					/>
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
					<p className="center tonedown-info small descend">
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
							updateKeychainStatusRef.current({ success: false, message: '' })
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
