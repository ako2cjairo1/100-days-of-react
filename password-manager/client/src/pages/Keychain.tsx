import '@/assets/modules/Keychain.css'
import google from '@/assets/google.png'
import apple from '@/assets/apple.png'
import github from '@/assets/github.png'
import {
	FormGroup,
	Header,
	KeychainForm,
	PasswordStrength,
	SubmitButton,
	Toolbar,
} from '@/components'
import { useAuthContext, useInput } from '@/hooks'
import { Modal } from '@/components/Modal'
import { useEffect, useState } from 'react'
import { KeychainContainer } from '@/components/KeychainContainer'
import { IKeychainItem, TKeychain, TStatus } from '@/types'
import {
	GeneratePassword,
	GenerateUUID,
	Log,
	MergeRegExObj,
} from '@/services/Utils/password-manager.helper'
import { REGISTER_STATE } from '@/services/constants'
import { KEYCHAIN_CONST } from '@/services/constants/Keychain.constants'

/**
 * Renders a Keychain component
 * returns A div element with the class "vault-container" containing a KeychainContainer, a Toolbar, and two Modal components
 */
export const Keychain = () => {
	const [newKeychainModal, setNewKeychainModal] = useState(false)
	const [showKeychainInfo, setShowKeychainInfo] = useState(false)
	const [keychainInfo, setKeychainInfo] = useState<Partial<IKeychainItem>>()
	const [clipboardStatus, setClipboardStatus] = useState<TStatus>({ success: false, message: '' })
	const { authInfo, updateAuthInfo } = useAuthContext()
	const [newKeychainStatus, setNewKeychainStatus] = useState<TStatus>({
		success: false,
		message: '',
	})

	// form controlled inputs
	const { resetInputState, inputAttributes } = useInput<TKeychain>({
		keychainId: '0',
		password: '',
		username: '',
		website: '',
		logo: '',
	})
	// destructure
	const { inputStates, onChange, onFocus, onBlur, mutate, isSubmitted, submitForm } =
		inputAttributes
	const { keychainId, website, username, password, logo } = inputStates

	const keychain: Array<TKeychain> = [
		{
			keychainId: '1',
			logo: apple,
			website: 'apple.com',
			username: 'ako2cjairo@icloud.com',
			password: '123234',
		},
		{
			keychainId: '2',
			logo: google,
			website: 'google.com',
			username: 'ako2cjairo@gmail.com',
			password: 'January231990',
		},
		{
			keychainId: '3',
			logo: github,
			website: 'github.com',
			username: 'ako2cjairo@gmail.com',
			password: 'password123',
		},
	]

	useEffect(() => {
		setNewKeychainStatus(prev => ({ ...prev, message: '' }))
	}, [inputStates])

	const handleOpenKeychain = (keychainId: string) => {
		const info = keychain.find(info => info.keychainId === keychainId)

		if (!info)
			return setClipboardStatus({
				success: false,
				message: 'Keychain information not found! Try again after a while.',
			})

		setShowKeychainInfo(true)
		setKeychainInfo(info)
	}

	const keychainFormCallback = (keychainInfo: Partial<TKeychain>) => {
		setClipboardStatus({
			success: false,
			message: '',
		})
		setShowKeychainInfo(false)

		// update info if there are changes
		if (keychainInfo) setKeychainInfo(keychainInfo)
	}

	return (
		<div className="vault-container">
			<Toolbar>
				<Toolbar.Item
					name="Logout"
					iconName="fa fa-sign-out"
					navigateTo="/login"
					menuCb={() =>
						updateAuthInfo({
							...authInfo,
							accessToken: '',
						})
					}
				/>

				<Toolbar.Item
					name="add item"
					iconName="fa fa-plus"
					menuCb={() => {
						setNewKeychainModal(true)
						mutate({ keychainId: GenerateUUID(), password: GeneratePassword() })
					}}
				/>
			</Toolbar>

			<Modal
				props={{
					isOpen: newKeychainModal,
					onClose: () => setNewKeychainModal(false),
					hideCloseButton: false,
					clickBackdropToClose: false,
				}}
			>
				<Header>
					<Header.Title
						title="Add Password"
						// subTitle="Create a free account with your email."
					/>
					<Header.Status status={{ success: false, message: '' }} />
				</Header>

				<FormGroup onSubmit={() => Log('TODO: handle submit')}>
					<div className="input-row">
						<FormGroup.Label
							props={{
								label: 'Website',
								labelFor: 'website',
								isFulfilled: KEYCHAIN_CONST.WEBSITE_REGEX.test(website ?? ''),
							}}
						/>
						<FormGroup.Input
							id="website"
							type="text"
							placeholder="sample.com"
							value={website}
							// linkRef={emailRef}
							disabled={false}
							{...{ onChange, onFocus, onBlur }}
						/>
					</div>
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
							placeholder="sample@email.com"
							value={username}
							// linkRef={emailRef}
							disabled={false}
							{...{ onChange, onFocus, onBlur }}
						/>
					</div>

					<div className="input-row">
						<FormGroup.Label
							props={{
								label: 'Password',
								labelFor: 'password',
								isFulfilled: password.trim() ? true : false,
							}}
						>
							<PasswordStrength
								password={password}
								regex={MergeRegExObj(REGISTER_STATE.PASSWORD_REGEX)}
							/>
						</FormGroup.Label>
						<FormGroup.Input
							id="password"
							type="text"
							value={password}
							disabled={false}
							{...{ onChange, onFocus, onBlur }}
						/>
					</div>
					<div style={{ display: 'flex', gap: '8px' }}>
						<SubmitButton
							variant="primary"
							submitted={!newKeychainModal}
							disabled={!KEYCHAIN_CONST.WEBSITE_REGEX.test(website ?? '') || !username || !password}
							onClick={() => console.log('Save button triggered!')}
						>
							Save
						</SubmitButton>
						<SubmitButton
							variant="cancel"
							submitted={false}
							disabled={false}
							onClick={() => setNewKeychainModal(false)}
						>
							Cancel
						</SubmitButton>
					</div>
				</FormGroup>
			</Modal>

			<KeychainContainer>
				<Header>
					<Header.Logo />
					<Header.Title title="Secured Vault" />
					<Header.Status status={clipboardStatus} />
				</Header>
				{!showKeychainInfo ? (
					<KeychainContainer.Keychain
						{...{ keychain }}
						event={handleOpenKeychain}
					/>
				) : (
					<KeychainForm
						{...keychainInfo}
						updateCallback={keychainFormCallback}
					/>
				)}
			</KeychainContainer>
		</div>
	)
}
