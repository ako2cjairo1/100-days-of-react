import { useEffect, useState } from 'react'
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

import { LocalStorage } from '@/services/Utils/password-manager.helper'

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
	const { mutateAuth } = useAuthContext()
	const [keychains, setKeychains] = useState<Array<TKeychain>>([])

	useEffect(() => {
		setKeychains(JSON.parse(LocalStorage.read('password_manager_data') || '[]'))
	}, [])

	const updateLocalStorage = (info: TKeychain[]) =>
		LocalStorage.write('password_manager_data', JSON.stringify(info))

	const updateKeychains = (keychainUpdate: TKeychain, type?: 'add' | 'update' | 'delete') => {
		if (
			type !== 'delete' &&
			keychains.find(
				keychainItem =>
					keychainItem.username === keychainUpdate.username &&
					keychainItem.website === keychainUpdate.website
			)
		) {
			return {
				success: false,
				message: 'You`ve already added this username for this site.',
			}
		}
		const previousKeychains = keychains.filter(
			keychain => keychain.keychainId !== keychainUpdate.keychainId
		)
		const updatedKeychains =
			type === 'delete' ? previousKeychains : [...previousKeychains, { ...keychainUpdate }]

		setKeychains(updatedKeychains)
		updateLocalStorage(updatedKeychains)
		return {
			success: true,
			message: 'Successfully added',
		}
	}

	const openKeychain = (keychainId: string, isEdit?: boolean) => {
		const info = keychains.find(info => info.keychainId === keychainId)

		if (!info)
			return setClipboardStatus({
				success: false,
				message: 'Keychain information not found! Try again after a while.',
			})

		setKeychain(info)
		isEdit ? addKeychainModal.open() : setShowKeychain(true)
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

	const addKeychainModal = {
		open: () => setShowModalForm(true),
		close: () => {
			setShowModalForm(false)
			// set the keychain to initial state
			setKeychain(KEYCHAIN)
			setShowKeychain(false)
		},
		toggle: (toggle: boolean) => (toggle ? addKeychainModal.open() : addKeychainModal.close()),
	}

	return (
		<div className="vault-container">
			<Menubar>
				<Menubar.Item
					name="Logout"
					iconName="fa fa-sign-out"
					navigateTo="/login"
					onClick={() => mutateAuth({ accessToken: '' })}
				/>

				<Menubar.Item
					name="add item"
					iconName="fa fa-plus"
					onClick={() => {
						setKeychain(KEYCHAIN)
						addKeychainModal.open()
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
			</KeychainContainer>

			<Modal
				isOpen={showModalForm}
				onClose={addKeychainModal.close}
				hideCloseButton={false}
				clickBackdropToClose={false}
			>
				<NewKeychainForm
					showForm={addKeychainModal.toggle}
					keychainInfo={keychain}
					updateCallback={updateKeychains}
				/>
			</Modal>
		</div>
	)
}
