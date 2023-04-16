import { useEffect, useMemo, useState } from 'react'
import '@/assets/modules/Vault.css'
import {
	VaultContainer,
	Modal,
	KeychainForm,
	Menubar,
	Keychain,
	AnimatedIcon,
	Header,
} from '@/components'
import { useAuthContext, useStateObj } from '@/hooks'
import { LocalStorage } from '@/services/Utils/password-manager.helper'
import { TKeychain, TStatus, TRequestType, TVaultContent } from '@/types'
import { RequestType, KEYCHAIN_CONST, FormContent } from '@/services/constants'

const { KEYCHAIN, STATUS } = KEYCHAIN_CONST
const { add, modify, view } = RequestType
const { vault_component, keychain_component } = FormContent
/**
 * Renders a Keychain component
 * returns A div element with the class "vault-container" containing a KeychainContainer, a Toolbar, and two Modal components
 */
export function Vault() {
	const { objState: keychain, mutate: updateKeychain } = useStateObj<TKeychain>(KEYCHAIN)
	const { objState: clipboardStatus, mutate: updateClipboardStatus } = useStateObj<TStatus>(STATUS)
	const [vault, setVault] = useState<TKeychain[]>([])

	const [isOpenModalForm, setIsOpenModalForm] = useState(false)
	const [formContent, setFormContent] = useState<TVaultContent>(vault_component)
	const { mutateAuth } = useAuthContext()

	useEffect(() => {
		// get password vault data from local storage
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

	const openKeychain = (keychainId?: string, action?: TRequestType) => {
		const info = vault.find(info => info.keychainId === keychainId)

		// throw an error message if keychainId is not found
		if (!info) {
			return updateClipboardStatus({
				success: false,
				message: 'Keychain information not found! Try again after a while.',
			})
		}

		// open the keychain info
		if (!action || action === view) {
			updateKeychain(info)
			return setFormContent(keychain_component)
		}

		// submit keychain info to Modal for update
		if (action === modify) {
			return keychainModal.open(info)
		}
	}

	const keychainFormCallback = (keychainId?: string) => {
		// hide keychain info and reset clipboard status
		setFormContent(vault_component)
		updateClipboardStatus(STATUS)

		// subsequently open a modal form if user choose to "Update"
		if (keychainId) openKeychain(keychainId, modify)
	}

	const keychainModal = useMemo(() => {
		return {
			open: (info?: TKeychain) => {
				// open Modal form with keychain info, blank if otherwise
				if (info) updateKeychain(info)
				setIsOpenModalForm(true)
			},
			close: () => {
				setIsOpenModalForm(false)
				// set the keychain state to initial values
				updateKeychain(KEYCHAIN)
				// then show Vault (keychain list)
				setFormContent(vault_component)
			},
			toggle: (toggle: boolean) => (toggle ? keychainModal.open() : keychainModal.close()),
		}
	}, [updateKeychain])

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
						updateKeychain(KEYCHAIN)
						keychainModal.open()
					}}
				/>
			</Menubar>

			<section className="form-container">
				{vault.some(Boolean) ? (
					<Header>
						<Header.Logo />
						<Header.Title title="Secured Vault" />
						<Header.Status status={clipboardStatus} />
					</Header>
				) : (
					<Header>
						<Header.Logo>
							<AnimatedIcon
								iconName="fa fa-face-rolling-eyes"
								animation="fa-shake"
							/>
						</Header.Logo>
						<Header.Title
							title="There are no Keychains here"
							subTitle='click "+" to Add one'
						/>

						{/* <SubmitButton
							style={{ width: '50%' }}
							props={{ iconName: 'fa fa-plus regular', variant: 'primary' }}
							onClick={() => keychainModal.open()}
						>
							Add Keychain
						</SubmitButton> */}
					</Header>
				)}

				{formContent === vault_component ? (
					<VaultContainer
						vault={vault}
						actionCallback={openKeychain}
					/>
				) : (
					<Keychain
						{...keychain}
						actionCallback={keychainFormCallback}
					/>
				)}
			</section>

			{/* TODO: create custom hook for modal */}
			<Modal
				isOpen={isOpenModalForm}
				onClose={keychainModal.close}
				hideCloseIcon={true}
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
