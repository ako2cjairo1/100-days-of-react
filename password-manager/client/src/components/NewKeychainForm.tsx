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
import { useInput, useTimedCopyToClipboard } from '@/hooks'
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
			inputAction.mutate({
				// get the logo from website
				// logo: await GetLogoUrlAsync(website),
			})

			try {
				// simulate api post request
				RunAfterSomeTime(() => {
					inputAction.submit(false)
					setKeychainStatus({ success: true, message: 'Password Saved!' })

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

	const handleAction = {
		generatePassword: () => {
			if (!isSubmitted) {
				passwordClipboard.clear()
				setRevealPassword(true)
				inputAction.mutate({ password: GeneratePassword() })
			}
		},
		copyPassword: () => {
			if (!passwordClipboard.isCopied) {
				usernameClipboard.clear()
				passwordClipboard.copy()
			}
		},
		copyUserName: () => {
			if (!usernameClipboard.isCopied) {
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
			if (!isSubmitted) {
				setKeychainStatus({ success: false, message: '[Not implemenmted]' })

				RunAfterSomeTime(() => setKeychainStatus({ success: false, message: '' }), 5)
			}
		},
	}

	// conditional rendering
	const checkIf = {
		isEditing: Object.values(keychainInfo || {}).some(Boolean),
		isClipboardTriggered: usernameClipboard.isCopied || passwordClipboard.isCopied,
		canDisableSubmit: isSubmitted || !WEBSITE_REGEX.test(website) || !username || !password,
		canCopyUsername: !usernameClipboard.isCopied && username,
		canCopyPassword: !passwordClipboard.isCopied && password,
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
									className={`regular ${isSubmitted ? 'disabled' : ''}`}
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
								isFulfilled: WEBSITE_REGEX.test(website),
							}}
						/>
						<FormGroup.Input
							id="website"
							type="text"
							linkRef={websiteInputRef}
							placeholder="ex: outlook.com"
							value={website}
							disabled={isSubmitted}
							required
							className={`${isSubmitted ? 'disabled' : ''}`}
							{...{ onChange, onFocus, onBlur }}
						/>
					</div>
				)}

				<div className="input-row">
					<FormGroup.Label
						props={{
							label: 'User Name',
							labelFor: 'username',
							isFulfilled: username.trim() ? true : false,
						}}
					/>
					<FormGroup.Input
						id="username"
						type="text"
						placeholder="ex: sample@email.com"
						value={username}
						disabled={isSubmitted}
						required
						className={`${isSubmitted ? 'disabled' : ''}`}
						{...{ onChange, onFocus, onBlur }}
					/>
					<div className="action-container">
						<AnimatedIcon
							className={`action-button small ${checkIf.canCopyUsername && 'active'}`}
							iconName="fa fa-clone fa-thin"
							onClick={handleAction.copyUserName}
						/>
					</div>
				</div>

				<div className="input-row vr">
					<FormGroup.Label
						props={{
							label: 'Password',
							labelFor: 'password',
							isFulfilled: password.trim() ? true : false,
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
							className={`${isSubmitted ? 'disabled' : ''}`}
							{...{ onChange, onFocus, onBlur }}
						/>

						<div className="action-container">
							<AnimatedIcon
								className={`action-button small ${password && 'active'}`}
								iconName={`fa fa-eye${revealPassword ? '-slash' : ''}`}
								onClick={handleAction.revealPassword}
							/>
							<AnimatedIcon
								className={`action-button small ${!isSubmitted && 'active'}`}
								iconName="fa fa-refresh"
								animation="fa-spin"
								onClick={handleAction.generatePassword}
							/>
							<AnimatedIcon
								className={`action-button small ${checkIf.canCopyPassword && 'active'}`}
								iconName="fa fa-clone"
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
						}}
						disabled={checkIf.canDisableSubmit}
					>
						{checkIf.isEditing ? 'Done' : 'Add Password'}
					</SubmitButton>
				</div>
			</FormGroup>
		</>
	)
}
