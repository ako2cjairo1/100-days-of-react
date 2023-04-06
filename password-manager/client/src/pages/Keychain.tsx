import '@/assets/modules/Keychain.css'
import google from '@/assets/google.png'
import apple from '@/assets/apple.png'
import github from '@/assets/github.png'
import { Header, KeychainForm, NewKeychainForm, Toolbar } from '@/components'
import { useAuthContext } from '@/hooks'
import { Modal } from '@/components/Modal'
import { useState } from 'react'
import { KeychainContainer } from '@/components/KeychainContainer'
import { IKeychainItem, TKeychain, TStatus } from '@/types'

/**
 * Renders a Keychain component
 * returns A div element with the class "vault-container" containing a KeychainContainer, a Toolbar, and two Modal components
 */
export function Keychain() {
	const [showModalForm, setShowModalForm] = useState(false)
	const [showKeychain, setShowKeychain] = useState(false)
	const [keychain, setKeychain] = useState<Partial<IKeychainItem>>()
	const [clipboardStatus, setClipboardStatus] = useState<TStatus>({ success: false, message: '' })

	const { authInfo, updateAuthInfo } = useAuthContext()

	const keychains: Array<TKeychain> = [
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

	const openKeychain = (keychainId: string) => {
		const info = keychains.find(info => info.keychainId === keychainId)

		if (!info)
			return setClipboardStatus({
				success: false,
				message: 'Keychain information not found! Try again after a while.',
			})

		setShowKeychain(true)
		setKeychain(info)
	}

	const keychainFormCallback = (keychainData: Partial<TKeychain>) => {
		setClipboardStatus({
			success: false,
			message: '',
		})
		setShowKeychain(false)

		// update info if there are changes
		if (keychainData) setKeychain(keychainData)
	}

	const showNewKeychainForm = (isShow: boolean) => setShowModalForm(isShow)

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
					menuCb={() => showNewKeychainForm(true)}
				/>
			</Toolbar>

			<KeychainContainer>
				<Header>
					<Header.Logo />
					<Header.Title title="Secured Vault" />
					<Header.Status status={clipboardStatus} />
				</Header>
				{!showKeychain ? (
					<KeychainContainer.Keychain
						{...{ keychain: keychains }}
						event={openKeychain}
					/>
				) : (
					<KeychainForm
						{...keychain}
						updateCallback={keychainFormCallback}
					/>
				)}
			</KeychainContainer>

			<Modal
				props={{
					isOpen: showModalForm,
					onClose: () => showNewKeychainForm(false),
					hideCloseButton: false,
					clickBackdropToClose: false,
				}}
			>
				<NewKeychainForm showForm={showNewKeychainForm} />
			</Modal>
		</div>
	)
}
