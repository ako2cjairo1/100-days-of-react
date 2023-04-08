import { useState } from 'react'
import '@/assets/modules/Keychain.css'
import {
	Header,
	KeychainContainer,
	KeychainForm,
	Modal,
	NewKeychainForm,
	Menubar,
} from '@/components'
import { useAuthContext } from '@/hooks'
import { IKeychainItem, TKeychain, TStatus } from '@/types'
import { KEYCHAIN_CONST } from '@/services/constants'

import google from '@/assets/google.png'
import apple from '@/assets/apple.png'
import github from '@/assets/github.png'

const { KEYCHAIN, STATUS } = KEYCHAIN_CONST
/**
 * Renders a Keychain component
 * returns A div element with the class "vault-container" containing a KeychainContainer, a Toolbar, and two Modal components
 */
export function Keychain() {
	const [showModalForm, setShowModalForm] = useState(false)
	const [showKeychain, setShowKeychain] = useState(false)
	const [keychain, setKeychain] = useState<IKeychainItem>(KEYCHAIN)
	const [clipboardStatus, setClipboardStatus] = useState<TStatus>(STATUS)
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

	const openKeychain = (keychainId: string, isEdit?: boolean) => {
		const info = keychains.find(info => info.keychainId === keychainId)

		if (!info)
			return setClipboardStatus({
				success: false,
				message: 'Keychain information not found! Try again after a while.',
			})

		setKeychain(info)
		isEdit ? toggleAddKeychainForm.open() : setShowKeychain(true)
	}

	const updateKeychainFormCallback = (keychainId?: string) => {
		// hide keychain info and reset clipboard status
		setShowKeychain(false)
		setClipboardStatus(STATUS)

		// subsequently open a modal form if user clicked "Edit"
		if (keychainId) {
			openKeychain(keychainId, true)
		}
	}

	const toggleAddKeychainForm = (() => {
		return {
			open: () => setShowModalForm(true),
			close: () => {
				setShowModalForm(false)
				// set the keychain to initial state
				setKeychain(KEYCHAIN)
				setShowKeychain(false)
			},
			toggle: (toggle: boolean) =>
				toggle ? toggleAddKeychainForm.open() : toggleAddKeychainForm.close(),
		}
	})()

	return (
		<div className="vault-container">
			<Menubar>
				<Menubar.Item
					name="Logout"
					iconName="fa fa-sign-out"
					navigateTo="/login"
					onClick={() =>
						updateAuthInfo({
							...authInfo,
							accessToken: '',
						})
					}
				/>

				<Menubar.Item
					name="add item"
					iconName="fa fa-plus"
					onClick={() => {
						setKeychain(KEYCHAIN)
						toggleAddKeychainForm.open()
					}}
				/>
			</Menubar>

			<KeychainContainer>
				<Header>
					<Header.Logo />
					<Header.Title title="Secured Vault" />
					<Header.Status status={clipboardStatus} />
				</Header>
				{!showKeychain ? (
					<KeychainContainer.Keychain
						{...{ keychains }}
						onClick={openKeychain}
					/>
				) : (
					<KeychainForm
						{...keychain}
						updateCallback={updateKeychainFormCallback}
					/>
				)}
				<Modal
					isOpen={showModalForm}
					onClose={toggleAddKeychainForm.open}
					hideCloseButton={false}
					clickBackdropToClose={false}
				>
					<NewKeychainForm
						showForm={toggleAddKeychainForm.toggle}
						keychainInfo={keychain}
					/>
				</Modal>
			</KeychainContainer>
		</div>
	)
}
