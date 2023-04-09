import '@/assets/modules/NewKeychainForm.css'
import { FormEvent, useEffect, useRef, useState } from 'react'
import {
	Header,
	FormGroup,
	PasswordStrength,
	SubmitButton,
	AnimatedIcon,
	InlineNotification,
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
		message: 'User Name copied!',
		callbackFn: () => setKeychainStatus(STATUS),
	})
	const passwordClipboard = useTimedCopyToClipboard({
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
				passwordClipboard.copy(password)
			}
		},
		copyUserName: () => {
			if (!usernameClipboard.isCopied) {
				passwordClipboard.clear()
				usernameClipboard.copy(username)
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

	const isEdit = Object.values(keychainInfo || {}).some(Boolean)

	return (
		<>
			<Header>
				{!isEdit ? (
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

						<div className="keychain-item">
							<img
								className="header"
								src={keychainInfo?.logo}
								alt={keychainInfo?.website}
							/>
							<div
								className="keychain-item-header"
								onClick={() => window.open(`//${keychainInfo?.website}`, '_blank')}
							>
								<a
									href={`//${keychainInfo?.website}`}
									rel="noreferrer"
									target="_blank"
								>
									{keychainInfo?.website}
								</a>
								<p>Last modified </p>
							</div>
							<Link
								to="/keychain"
								title="Delete"
								className="menu descend"
								onClick={handleAction.deletePassword}
							>
								<AnimatedIcon
									className={`regular ${isSubmitted ? 'disabled' : ''}`}
									iconName="fa fa-trash"
									animation="fa-shake"
								/>
							</Link>
						</div>
					</>
				)}
			</Header>

			<FormGroup onSubmit={submitKeychainForm}>
				{!isEdit && (
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
					<AnimatedIcon
						className={`action-button copy-username small ${!usernameClipboard.isCopied && username && 'active'
							}`}
						iconName="fa fa-clone"
						onClick={handleAction.copyUserName}
					/>
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
								className={`action-button small ${!passwordClipboard.isCopied && password && 'active'
									}`}
								iconName="fa fa-clone"
								onClick={handleAction.copyPassword}
							/>
						</div>

						<p className="center small descend">
							Adding the password here saves it only to your registered account. Make sure the
							password you save here matches your password for the website.
						</p>
						{(usernameClipboard.isCopied || passwordClipboard.isCopied) && (
							<InlineNotification>
								{usernameClipboard.isCopied
									? usernameClipboard.statusMessage
									: passwordClipboard.statusMessage}
							</InlineNotification>
						)}
					</div>
				</div>

				<div className='center'>
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
						disabled={isSubmitted || !WEBSITE_REGEX.test(website) || !username || !password}
					>
						{isEdit ? 'Done' : 'Add Password'}
					</SubmitButton>
				</div>
			</FormGroup>
		</>
	)
}
