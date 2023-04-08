import { FormEvent, useEffect, useRef, useState } from 'react'
import { Header, FormGroup, PasswordStrength, SubmitButton } from '.'
import { useInput, useTimedCopyToClipboard } from '@/hooks'
import { TFunction, TKeychain, TStatus } from '@/types'
import {
	CreateError,
	GeneratePassword,
	GenerateUUID,
	Log,
	MergeRegExObj,
	RunAfterSomeTime,
} from '@/services/Utils/password-manager.helper'
import { REGISTER_STATE, KEYCHAIN_CONST } from '@/services/constants'

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

					// close the modal after sometime
					RunAfterSomeTime(() => {
						setKeychainStatus(STATUS)
						showForm(true)

						// invoke resetInput
						// inputAction.resetInput()
					}, 3)
				}, 3)
			} catch (error) {
				setKeychainStatus({ success: false, message: CreateError(error).message })
			}
		}
	}

	return (
		<>
			<Header>
				{!Object.values(keychainInfo || {}).some(Boolean) ? (
					<Header.Title
						title="Add Password"
						subTitle="We will save this password in your session storage and cloud account"
					/>
				) : (
					<div className="keychain-item">
						<img
							className="header"
							src={keychainInfo?.logo}
							alt={keychainInfo?.website}
						/>
						<div className="keychain-item-header">
							<a
								href={`//${keychainInfo?.website}`}
								rel="noreferrer"
								target="_blank"
							>
								{keychainInfo?.website}
							</a>
							<p>Last modified </p>
						</div>
					</div>
				)}
				<Header.Status status={keychainStatus} />
			</Header>

			<FormGroup onSubmit={submitKeychainForm}>
				{!Object.values(keychainInfo || {}).some(Boolean) && (
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
					<i
						className={`fa fa-clone small action-button ${!usernameClipboard.isCopied && username && 'active'
							}`}
						style={{
							position: 'absolute',
							padding: '5px',
							right: '8px',
							bottom: '10px',
							borderRadius: '20px',
						}}
						onClick={() => {
							if (!usernameClipboard.isCopied) {
								passwordClipboard.clear()
								usernameClipboard.copy(username)
								setKeychainStatus({ success: true, message: usernameClipboard.statusMessage })
							}
						}}
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

						<div
							style={{
								position: 'absolute',
								right: '5px',
								top: '47px',
								display: 'flex',
								justifyContent: 'space-around',
								width: '85px',
							}}
						>
							<i
								className={`fa fa-eye${revealPassword ? '-slash' : ''} small action-button ${password && 'active'
									}`}
								style={{
									padding: '5px',
									borderRadius: '20px',
								}}
								onClick={() => {
									if (password) {
										setRevealPassword(prev => !prev)
									}
								}}
							/>
							<i
								className={`fa fa-refresh small action-button ${!isSubmitted && 'active'}`}
								style={{
									padding: '5px',
									borderRadius: '20px',
								}}
								onClick={() => {
									if (!isSubmitted) {
										passwordClipboard.clear()
										setRevealPassword(true)
										inputAction.mutate({ password: GeneratePassword() })
									}
								}}
							/>
							<i
								className={`fa fa-clone small action-button ${!passwordClipboard.isCopied && password && 'active'
									}`}
								style={{
									padding: '5px',
									borderRadius: '20px',
								}}
								onClick={() => {
									if (!passwordClipboard.isCopied) {
										usernameClipboard.clear()
										passwordClipboard.copy(password)
										Log(passwordClipboard.statusMessage)
										setKeychainStatus({ success: true, message: passwordClipboard.statusMessage })
									}
								}}
							/>
						</div>
						<p className="center small">
							Adding the password here saves it only to your registered account. Make sure the
							password you save here matches your password for the website.
						</p>
					</div>
				</div>

				<div style={{ display: 'flex', gap: '8px' }}>
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
						Save
					</SubmitButton>
				</div>
			</FormGroup>
		</>
	)
}
