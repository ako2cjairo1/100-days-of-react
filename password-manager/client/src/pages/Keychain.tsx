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
import { Log, MergeRegExObj } from '@/services/Utils/password-manager.helper'
import { REGISTER_STATE } from '@/services/constants'

/**
 * Renders a Keychain component
 * returns A div element with the class "vault-container" containing a KeychainContainer, a Toolbar, and two Modal components
 */
export const Keychain = () => {
	const [newKeychainModal, setNewKeychainModal] = useState(false)
	const [viewKeychainModal, setViewKeychainModal] = useState(false)
	const [keychainInfo, setKeychainInfo] = useState<Partial<IKeychainItem>>()
	const [clipboardStatus, setClipboardStatus] = useState<TStatus>({ success: false, message: '' })
	const { authInfo, updateAuthInfo } = useAuthContext()
	const [newKeychainStatus, setNewKeychainStatus] = useState<TStatus>({
		success: false,
		message: '',
	})

	// form controlled inputs
	const { resetInputState, inputAttributes } = useInput<Partial<TKeychain>>({})
	// destructure
	const { inputStates, onChange, onFocus, onBlur, mutate, isSubmitted, submitForm } =
		inputAttributes
	const { keychainId, website, username, password, logo } = inputStates

	const keychain = [
		{
			keychainId: 1,
			logo: apple,
			link: 'apple.com',
			username: 'ako2cjairo@icloud.com',
			password: '123234',
		},
		{
			keychainId: 2,
			logo: google,
			link: 'google.com',
			username: 'ako2cjairo@gmail.com',
			password: 'January231990',
		},
		{
			keychainId: 3,
			logo: github,
			link: 'github.com',
			username: 'ako2cjairo@gmail.com',
			password: 'password123',
		},
	]

	useEffect(() => {
		setNewKeychainStatus(prev => ({ ...prev, message: '' }))
	}, [inputStates])

	const handleOpenKeychain = (keychainId: number) => {
		const info = keychain.find(info => info.keychainId === keychainId)

		if (!info)
			return setClipboardStatus({
				success: false,
				message: 'Keychain information not found! Try again after a while.',
			})

		setViewKeychainModal(true)
		setKeychainInfo(info)
	}

	const callback = () => {
		setKeychainInfo({})
		setClipboardStatus({
			success: false,
			message: '',
		})
		setViewKeychainModal(false)
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
					menuCb={() => setNewKeychainModal(true)}
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
								isFulfilled: false,
								isOptional: true,
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
								isFulfilled: false,
								isOptional: true,
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
								isFulfilled: false,
								isOptional: true,
							}}
						>
							<PasswordStrength
								password={password}
								regex={MergeRegExObj(REGISTER_STATE.PASSWORD_REGEX)}
							/>
						</FormGroup.Label>
						<FormGroup.Input
							id="password"
							type="password"
							value={password}
							disabled={false}
							{...{ onChange, onFocus, onBlur }}
						/>
					</div>
					<div style={{ display: 'flex', width: '70%', gap: '8px' }}>
						<SubmitButton
							variant="primary"
							className="accent-bg"
							iconName="fa-user-plus"
							submitted={!newKeychainModal}
							disabled={false}
							onClick={() => console.log('Save button triggered!')}
						>
							Save
						</SubmitButton>
						<SubmitButton
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
					<Header.Title title="Secured Keychain" />
					<Header.Status status={clipboardStatus} />
				</Header>
				{!viewKeychainModal ? (
					<KeychainContainer.Keychain {...{ keychain, event: handleOpenKeychain }} />
				) : (
					<KeychainForm
						{...keychainInfo}
						cbFn={callback}
					/>
				)}
			</KeychainContainer>
		</div>
	)
}
