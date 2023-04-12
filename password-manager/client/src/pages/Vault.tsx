import { useEffect, useState } from 'react'
import '@/assets/modules/Vault.css'
import { Header, VaultContainer, Modal, KeychainForm, Menubar, Keychain } from '@/components'
import { useAuthContext } from '@/hooks'
import { IKeychainItem, TKeychain, TStatus, TRequestType, TVaultContent } from '@/types'
import { RequestType, KEYCHAIN_CONST } from '@/services/constants'
import { LocalStorage } from '@/services/Utils/password-manager.helper'

const { KEYCHAIN, STATUS } = KEYCHAIN_CONST
const { add, modify } = RequestType
/**
 * Renders a Keychain component
 * returns A div element with the class "vault-container" containing a KeychainContainer, a Toolbar, and two Modal components
 */
export function Vault() {
	const [showModalForm, setShowModalForm] = useState(false)
	const [currentView, setView] = useState<TVaultContent>('vault')
	const [keychain, setKeychain] = useState<IKeychainItem>(KEYCHAIN)
	const [clipboardStatus, setClipboardStatus] = useState<TStatus>(STATUS)
	const { mutateAuth } = useAuthContext()
	const [vault, setVault] = useState<TKeychain[]>([])

	useEffect(() => {
		setVault(JSON.parse(LocalStorage.read('password_manager_data') || '[]'))
	}, [])

	// TODO: implement these as controller methods for API
	const updateLocalStorage = (info: TKeychain[]) =>
		LocalStorage.write('password_manager_data', JSON.stringify(info))

	const mutateVault = (keychainUpdate: TKeychain, requestType: TRequestType): TStatus => {
		const cantAddDuplicate =
			requestType === add &&
			vault.some(
				({ username, website }) =>
					username === keychainUpdate.username && website === keychainUpdate.website
			)
		if (cantAddDuplicate) {
			return {
				success: false,
				message: 'You`ve already added this username for this website.',
			}
		}

		// for delete action, remove the submitted keychain info from vault
		let tempVault = vault.filter(({ keychainId }) => keychainId !== keychainUpdate.keychainId)

		if (requestType === add || requestType === modify) {
			const keychainUpdateWithTimeAgo: TKeychain = {
				...keychainUpdate,
				timeAgo: new Date().toString(),
			}
			// clone vault and modify using submitted Keychain info
			tempVault = [keychainUpdateWithTimeAgo, ...tempVault]
		}

		setVault(tempVault)
		updateLocalStorage(tempVault)

		return {
			success: true,
			message: 'Success',
		}
	}

	const openKeychain = (keychainId: string, action?: TRequestType) => {
		const info = vault.find(info => info.keychainId === keychainId)

		if (!info) {
			return setClipboardStatus({
				success: false,
				message: 'Keychain information not found! Try again after a while.',
			})
		}
		// set info and show the details in modal (if editing) or form view (if viewing)
		setKeychain(info)
		action === modify ? keychainModal.open() : setView('keychain')
	}

	const keychainFormCallback = (keychainId?: string) => {
		// hide keychain info and reset clipboard status
		setView('vault')
		setClipboardStatus(STATUS)

		// subsequently open a modal form if user choose to "Update"
		if (keychainId) {
			openKeychain(keychainId, modify)
		}
	}

	const keychainModal = {
		open: () => setShowModalForm(true),
		close: () => {
			setShowModalForm(false)
			// set the keychain to initial state
			setKeychain(KEYCHAIN)
			setView('vault')
		},
		toggle: (toggle: boolean) => (toggle ? keychainModal.open() : keychainModal.close()),
	}

	const VaultContent = {
		vault: (
			<VaultContainer.Vault
				{...{ vault, onClick: openKeychain }}
				// onClick={openKeychain}
			/>
		),
		keychain: (
			<Keychain
				{...keychain}
				actionCallback={keychainFormCallback}
			/>
		),
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
						keychainModal.open()
					}}
				/>
			</Menubar>

			<VaultContainer>
				<Header>
					<Header.Logo />
					<Header.Title title="Secured Vault" />
					<Header.Status status={clipboardStatus} />
				</Header>

				{VaultContent[currentView]}
			</VaultContainer>

			<Modal
				isOpen={showModalForm}
				onClose={keychainModal.close}
				hideCloseButton={true}
				clickBackdropToClose={false}
			>
				<KeychainForm
					showForm={keychainModal.toggle}
					keychainInfo={keychain}
					updateCallback={mutateVault}
				/>
			</Modal>
		</div>
	)
}
