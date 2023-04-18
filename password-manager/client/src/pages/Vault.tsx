import { useEffect, useMemo, useRef, useState } from 'react'
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
import { CreateError, LocalStorage, Log } from '@/services/Utils/password-manager.helper'
import { TKeychain, TStatus, TRequestType, TVaultContent } from '@/types'
import { RequestType, KEYCHAIN_CONST, FormContent } from '@/services/constants'
import { SearchBar } from '@/components/SearchBar'

const { KEYCHAIN, STATUS } = KEYCHAIN_CONST
const { add, modify, view } = RequestType
const { vault_component, keychain_component } = FormContent
/**
 * Renders a Keychain component
 * returns A div element with the class "vault-container" containing a KeychainContainer, a Toolbar, and Modal component
 */
export function Vault() {
	const { objState: keychain, mutate: updateKeychain } = useStateObj<TKeychain>(KEYCHAIN)
	const { objState: vaultStatus, mutate: updateVaultStatus } = useStateObj<TStatus>(STATUS)
	const [vault, setVault] = useState<TKeychain[]>([])

	const [isOpenModalForm, setIsOpenModalForm] = useState(false)
	const [formContent, setFormContent] = useState<TVaultContent>(vault_component)
	const { mutateAuth } = useAuthContext()
	const vaultCountRef = useRef(0)

	const getVaultData = () => {
		// TODO: implement cache mechanism
		// get password vault data from local storage
		const vaultData = JSON.parse(LocalStorage.read('password_manager_data') || '[]')
		setVault(vaultData)
		vaultCountRef.current = vaultData.length

		return vaultData
	}

	useEffect(() => {
		// get password vault data from local storage
		getVaultData()
		Log('Loading Data...')
	}, [])

	// TODO: implement these as controller methods for API
	const updateLocalStorage = (info: TKeychain[]) =>
		LocalStorage.write('password_manager_data', JSON.stringify(info))

	const mutateVault = (keychainUpdate: TKeychain, requestType: TRequestType): TStatus => {
		const vaultData: TKeychain[] = getVaultData()

		const cantAddDuplicate =
			requestType === add &&
			vaultData.some(
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
		let tempVault = vaultData.filter(({ keychainId }) => keychainId !== keychainUpdate.keychainId)

		// for "add" and "modify" requests: append timeAgo prop
		if (requestType === add || requestType === modify) {
			const keychainUpdateWithTimeAgo: TKeychain = {
				...keychainUpdate,
				timeAgo: new Date().toString(),
			}
			// clone vault and append submitted Keychain info
			tempVault = [keychainUpdateWithTimeAgo, ...tempVault]
		}

		try {
			updateLocalStorage(tempVault)
			setVault(tempVault)
			getVaultData()
			return {
				success: true,
				message: 'Success',
			}
		} catch (error) {
			return {
				success: false,
				message: CreateError(error).message,
			}
		}
	}

	const openKeychain = (keychainId?: string, action?: TRequestType) => {
		const info = vault.find(info => info.keychainId === keychainId)

		// throw an error message if keychainId is not found
		if (!info) {
			return updateVaultStatus({
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
		updateVaultStatus(STATUS)
		updateKeychain(KEYCHAIN)

		// subsequently open a modal form if user choose to "Update"
		if (keychainId) openKeychain(keychainId, modify)
	}

	const handleSearch = (searchKey: string): number => {
		const vaultData: TKeychain[] = getVaultData()
		let searchResult = vaultData

		if (searchKey.length > 0) {
			searchResult = vaultData.filter(
				item =>
					item.username.toLowerCase().includes(searchKey) ||
					item.website.toLowerCase().includes(searchKey)
			)
		}
		setVault(searchResult)

		return searchResult.length
	}

	const keychainModal = useMemo(() => {
		return {
			open: (info?: TKeychain) => {
				// open Modal form with keychain info, blank if otherwise
				updateKeychain(info ? info : KEYCHAIN)
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
					onClick={() => keychainModal.open()}
				/>
			</Menubar>

			<section className="form-container">
				{vault.some(Boolean) ? (
					<Header>
						<Header.Logo />
						<Header.Title title="Secured Vault" />
						<div className="center">
							<p className="small">{`${vaultCountRef.current} keychains save.`}</p>
							<p className="x-small disabled">(0 leaked, 0 reused, 5 weak)</p>
						</div>
						<Header.Status status={vaultStatus} />
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
					</Header>
				)}

				{formContent === vault_component ? (
					<>
						{vaultCountRef.current > 0 && <SearchBar searchCallback={handleSearch} />}

						<VaultContainer
							vault={vault}
							actionCallback={openKeychain}
						/>
					</>
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
				// hideCloseIcon={true}
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
