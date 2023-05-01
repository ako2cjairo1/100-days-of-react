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
	SearchBar,
} from '@/components'
import { useAuthContext, useStateObj } from '@/hooks'
import { CreateError, Log, SessionStorage } from '@/services/Utils/password-manager.helper'
import type { TKeychain, TStatus, TRequestType, TVaultContent } from '@/types'
import { RequestType, KEYCHAIN_CONST, FormContent, AUTH_CONTEXT } from '@/services/constants'
import { decryptVault, encryptVault } from '@/services/Utils/crypto'
import { logoutUserService, updateVaultService } from '@/api'

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
	const {
		authInfo: { accessToken },
		mutateAuth,
	} = useAuthContext()
	const vaultCountRef = useRef(0)

	const hydrateAndGetVault = () => {
		let currentVault = []
		try {
			const encryptedVault = SessionStorage.read('PM_encrypted_vault')
			if (encryptedVault) {
				// use vaultKey to decrypt Vault (combination of email, hashed password and salt from API)
				currentVault = decryptVault({
					vault: encryptedVault,
					vaultKey: SessionStorage.read('PM_VK'),
				})
			}
			// hydrate Vault state
			setVault(currentVault)
			// remember how many items on current Vault
			vaultCountRef.current = currentVault.length
		} catch (error) {
			Log("We can't access your Vault! Try logging out and in..")
		}

		return currentVault
	}

	useEffect(() => {
		Log('Loading your Vault...')
		// get encrypted Vault data from session storage
		hydrateAndGetVault()
	}, [])

	// encrypt current Vault, store on session storage and finally, update database
	const syncDatabaseUpdate = async (vault: TKeychain[]) => {
		const encryptedVault = encryptVault({
			vault: JSON.stringify(vault),
			vaultKey: SessionStorage.read('PM_VK'),
		})
		// send encrypted update to database
		await updateVaultService({ encryptedVault, accessToken })
		// store local copy of encryptedVault in session storage
		SessionStorage.write([['PM_encrypted_vault', encryptedVault]])
		hydrateAndGetVault()
	}

	const mutateVault = async (
		keychainUpdate: TKeychain,
		requestType: TRequestType
	): Promise<TStatus> => {
		const currentVault: TKeychain[] = hydrateAndGetVault()

		try {
			// checks if email and website is already on the Vault list
			const cantAddDuplicate =
				requestType === add &&
				currentVault.some(
					({ username, website }) =>
						username === keychainUpdate.username && website === keychainUpdate.website
				)
			if (cantAddDuplicate) {
				return {
					success: false,
					message: 'You`ve already added this username for this website.',
				}
			}
			// for "Delete" action, remove keychain from current Vault
			let tempVault = currentVault.filter(
				({ keychainId }) => keychainId !== keychainUpdate.keychainId
			)
			// for "Add" and "Modify" actions: append timeAgo prop
			if (requestType === add || requestType === modify) {
				const keychainUpdateWithTimeAgo: TKeychain = {
					...keychainUpdate,
					timeAgo: new Date().toString(),
				}
				// clone current Vault then append Keychain update on the top of the list
				tempVault = [keychainUpdateWithTimeAgo, ...tempVault]
			}

			await syncDatabaseUpdate(tempVault)

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
		// subsequently open a modal form if user choose to "Update" a keychain
		if (keychainId) openKeychain(keychainId, modify)
	}

	const handleSearch = (searchKey: string): number => {
		const vaultData: TKeychain[] = hydrateAndGetVault()
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

	const handleLogout = async () => {
		try {
			// call backend to invalidate user tokens
			// ..update login info to database
			await logoutUserService(accessToken)
		} catch (error) {
			Log(CreateError(error).message)
		} finally {
			// reset auth context
			mutateAuth(AUTH_CONTEXT.authInfo)
			// clear session storage (Vault and saltKey)
			SessionStorage.clear()
		}
	}

	return (
		<div className="vault-container">
			<Menubar>
				<Menubar.Item
					name="Logout"
					iconName="fa fa-sign-out"
					navigateTo="/login"
					onClick={handleLogout}
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
							title="There are no Keychains"
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
