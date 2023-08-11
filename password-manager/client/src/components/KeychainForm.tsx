import { FormEvent, useEffect, useRef, useState } from 'react'
import '@/assets/modules/KeychainForm.css'
import type { TFunction, TKeychain, TStatus, TRequestType } from '@/types'
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
	BusyIndicator,
	KeychainCard,
} from '@/components'
import { useDebounceToggle, useInput, useTimedCopyToClipboard } from '@/hooks'
import {
	CreateError,
	ExtractValFromRegEx,
	GeneratePassword,
	GenerateUUID,
	GetDomainUrl,
	IsEmpty,
	RunAfterSomeTime,
	TimeAgo,
} from '@/services/Utils'
import { KEYCHAIN_CONST, RequestType } from '@/services/constants'
import { useAppDispatch, useAppSelector } from '@/services/store/hooks'
import { selectAppStatus, updateAppStatus } from '@/services/store/features'

const { INIT_STATUS, INIT_KEYCHAIN, WEBSITE_REGEX, ILLEGAL_REGEX } = KEYCHAIN_CONST
const { add, update, remove } = RequestType

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

	const usernameClipboard = useTimedCopyToClipboard({ message: 'Username is copied to clipboard!' })
	const passwordClipboard = useTimedCopyToClipboard({ message: 'Password is copied to clipboard!' })

	// redux attribs
	const dispatch = useRef(useAppDispatch())
	const { loading, message, success } = useAppSelector(selectAppStatus)

	// conditional rendering properties
	const checkIf = {
		isKeychainIdPresent: !IsEmpty(keychainInfo?.keychainId),
		isClipboardTriggered: usernameClipboard.isCopied || passwordClipboard.isCopied,
		isValidWebsite: WEBSITE_REGEX.test(input.website),
		isValidUsername: !IsEmpty(input.username) && !ILLEGAL_REGEX.test(input.username),
		isValidPassword: !IsEmpty(input.password) && !ILLEGAL_REGEX.test(input.password),
		canCopyUsername: !usernameClipboard.isCopied && !IsEmpty(input.username),
		canCopyPassword: !passwordClipboard.isCopied && !IsEmpty(input.password),
		canGeneratePassword: !isSubmitted && !success,
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
				success ||
				!checkIf.isValidWebsite ||
				!checkIf.isValidUsername ||
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
			keychainId: checkIf.isKeychainIdPresent ? keychainInfo?.keychainId : GenerateUUID(),
			password: checkIf.isKeychainIdPresent ? keychainInfo?.password : GeneratePassword(),
		})
	}, [checkIf.isKeychainIdPresent, keychainInfo])

	// side-effect to focus the cursor to input Website
	useEffect(() => {
		if (!success) websiteInputRef.current?.focus()
	}, [success])

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
				dispatch.current(updateAppStatus({ success: true, message: 'Password Deleted!' }))

				// after sometime, reset status and close modal
				RunAfterSomeTime(() => {
					dispatch.current(updateAppStatus(INIT_STATUS))
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
				dispatch.current(updateAppStatus(INIT_STATUS))

				try {
					// post request to update/add keychain info
					const { success, message } = await updateCallback(
						// format to correct website url
						{ ...input, website: GetDomainUrl(input.website).url },
						checkIf.isKeychainIdPresent ? update : add
					)
					if (!success) throw new Error(message)

					const successMessage = checkIf.isKeychainIdPresent
						? 'The changes have been saved'
						: 'Password have been added!'
					// show success status before closing the modal
					dispatch.current(updateAppStatus({ success: true, message: successMessage }))

					// after sometime, reset status and close modal
					RunAfterSomeTime(() => {
						dispatch.current(updateAppStatus(INIT_STATUS))
						showForm(false)
						// invoke resetInput
						resetInput()
					}, 2)
				} catch (error) {
					dispatch.current(updateAppStatus({ success: false, message: CreateError(error).message }))
				} finally {
					isSubmit(false)
				}
			}
		},
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
		<>
			<Header>
				<Header.Logo>{checkIf.isKeychainIdPresent ? 'Edit Password' : 'Add Password'}</Header.Logo>

				{!checkIf.isKeychainIdPresent && (
					<Header.Title subTitle="We will save this password in your session storage and in cloud." />
				)}

				<Header.Status
					status={{ success, message }}
					icon={message.toLowerCase().includes('delete') ? 'danger fa fa-trash-can fa-bounce' : ''}
				/>
			</Header>

			{checkIf.isKeychainIdPresent && (
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
										isSubmitted || success ? 'disabled' : 'active'
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
				{!checkIf.isKeychainIdPresent && (
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
							isFulfilled: checkIf.isValidUsername,
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
								: checkIf.isValidUsername
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
					<ValidationMessage
						isVisible={!isFocus.username && !checkIf.isValidUsername && !IsEmpty(input.username)}
						validations={[
							{
								isValid: checkIf.isValidUsername,
								message: `User Name must not contain illegal character(s): ${ExtractValFromRegEx(
									ILLEGAL_REGEX.source
								)}`,
							},
						]}
					/>
				</div>

				<div className="input-row vr">
					<FormGroup.Label
						props={{
							label: 'Password',
							labelFor: 'password',
							isFulfilled: checkIf.isValidPassword,
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
								message: `Password must not contain illegal character(s): ${ExtractValFromRegEx(
									ILLEGAL_REGEX.source
								)}`,
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
						Adding password here saves it only to your Secured Vault account. Make sure the password
						you save here matches your password for the website.
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
							dispatch.current(updateAppStatus({ success: false, message: '' }))
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
						{checkIf.isKeychainIdPresent ? 'Save' : 'Add Password'}
					</SubmitButton>
				</div>
			</FormGroup>
		</>
	)
}
