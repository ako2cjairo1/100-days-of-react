import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '@/assets/modules/Vault.css'
import type { TKeychain, TStatus, TRequestType, TVaultContent, IMenuItem } from '@/types'
import {
	Modal,
	KeychainForm,
	Keychain,
	AnimatedIcon,
	Header,
	SearchBar,
	BusyIndicator,
	MenubarContainer,
	KeychainCardContainer,
} from '@/components'
import { useStateObj } from '@/hooks'
import {
	CreateError,
	ExportToCSV,
	ImportCSVToJSON,
	IsEmpty,
	SessionStorage,
	decryptVault,
	encryptVault,
	GenerateUUID,
} from '@/utils'
import { updateVaultService } from '@/services/api'
import { RequestType, KEYCHAIN_CONST, FormContent } from '@/services/constants'
import { useAppDispatch, useAppSelector } from '@/services/store/hooks'
import {
	fetchAuthSession,
	logoutUser,
	selectAuthentication,
	updateAppStatus,
	updateAuthStatus,
} from '@/services/store/features'
import { VaultHeader } from '@/components/Header/VaultHeader'

const { INIT_KEYCHAIN, INIT_STATUS } = KEYCHAIN_CONST
const { add, update: modify, view } = RequestType
const { vault_component, keychain_component } = FormContent
/**
 * Renders a Keychain component
 * returns A div element with the class "vault-container" containing a KeychainContainer, a Toolbar, and Modal component
 */
export function Vault() {
	const [keychain, mutateKeychain] = useStateObj<TKeychain>(INIT_KEYCHAIN)
	const [vault, setVault] = useState<TKeychain[]>([])
	const [isOpenModalForm, setIsOpenModalForm] = useState(false)
	const [formContent, setFormContent] = useState<TVaultContent>(vault_component)

	const vaultCountRef = useRef(0)
	const authRef = useRef(true)
	const navigate = useRef(useNavigate())

	// redux attribs
	const dispatch = useRef(useAppDispatch())
	const {
		auth: { isLoggedIn, vaultKey },
		loading,
		message,
		success,
	} = useAppSelector(selectAuthentication)

	const hydrateAndGetVault = useCallback(() => {
		let decryptedVault: TKeychain[] = []
		try {
			const vault = SessionStorage.read('PM_encrypted_vault')
			if (vault) {
				// vaultKey to decrypt Vault (combination of email, hashed password and salt from Auth Server)
				decryptedVault = decryptVault({ vault, vaultKey })
			}
			// update Vault state
			setVault(decryptedVault)
			// remember how many items on current Vault
			vaultCountRef.current = decryptedVault.length
		} catch (error) {
			navigate.current(
				{
					pathname: '/error',
					search: `error=We can't access your Vault. ${CreateError(error).message}`,
				},
				{ replace: true }
			)
		}

		return decryptedVault
	}, [vaultKey])

	// to persist authentication
	useEffect(() => {
		dispatch.current(updateAuthStatus({ message: '', success: false }))
		// currently logged-in? hydrate current User's Vault
		if (isLoggedIn) hydrateAndGetVault()
		// otherwise, get authentication from auth server (only once: authRef)
		else if (authRef.current) {
			dispatch.current(fetchAuthSession())
			// redirect to login if unsuccessful authentication
			if (!success) navigate.current('/login', { replace: true })
			authRef.current = false
		}
	}, [hydrateAndGetVault, isLoggedIn, success])

	// encrypt current Vault, store on session storage and finally, update database
	const syncVaultUpdate = async (vault: TKeychain[]) => {
		const encryptedVault = encryptVault({ vault, vaultKey })
		// send encrypted update to database
		await updateVaultService({ encryptedVault })
		// store local copy of encryptedVault in session storage
		SessionStorage.write([['PM_encrypted_vault', encryptedVault]])
		hydrateAndGetVault()
	}

	const mutateVault = async (
		keychainUpdate: TKeychain,
		requestType: TRequestType
	): Promise<TStatus> => {
		const currentVault = hydrateAndGetVault()

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
			const vaultUpdate = currentVault.filter(
				({ keychainId }) => keychainId !== keychainUpdate.keychainId
			)
			// for "Add" and "Modify" actions: append timeAgo prop
			if (requestType === add || requestType === modify) {
				// append Keychain update on the top of the list
				vaultUpdate.unshift({
					...keychainUpdate,
					timeAgo: new Date().toString(),
				})
			}

			await syncVaultUpdate(vaultUpdate)

			return {
				success: true,
				message: 'Success',
			}
		} catch (error) {
			const { code, message } = CreateError(error)
			if (code === 401 || code === 403)
				navigate.current({ pathname: '/error', search: `error=${error}` })
			return {
				success: false,
				message: message,
			}
		}
	}

	const openKeychain = (keychainId?: string, action?: TRequestType) => {
		if (!isLoggedIn) navigate.current('/login', { replace: true })

		const keychainInfo = vault.find(info => info.keychainId === keychainId)
		// throw an error message if keychainId is not found
		if (!keychainInfo) {
			return dispatch.current(
				updateAppStatus({
					success: false,
					message: 'Keychain information not found! Try again after a while.',
				})
			)
		}
		// open the keychain info
		if (IsEmpty(action) || action === view) {
			mutateKeychain(keychainInfo)
			return setFormContent(keychain_component)
		}
		// submit keychain info to Modal for update
		if (action === modify) {
			return keychainModal.open(keychainInfo)
		}
	}

	const keychainHandler = (keychainId?: string) => {
		// hide keychain info and reset clipboard status
		setFormContent(vault_component)
		dispatch.current(updateAppStatus(INIT_STATUS))
		mutateKeychain(INIT_KEYCHAIN)
		// subsequently open a modal form if user choose to "Update" a keychain
		if (keychainId) openKeychain(keychainId, modify)
	}

	const handleSearch = (searchKey = ''): number => {
		const vaultData: TKeychain[] = hydrateAndGetVault()
		let searchResult = vaultData

		if (!IsEmpty(searchKey)) {
			const key = searchKey.toLowerCase()
			searchResult = vaultData.filter(
				item =>
					item.username.toLowerCase().includes(key) || item.website.toLowerCase().includes(key)
			)
		}
		setVault(searchResult)

		return searchResult.length
	}

	const handleLogout = async () => {
		// to invalidate user tokens, update login info to database
		dispatch.current(logoutUser())
		// clear session storage (Vault and saltKey)
		SessionStorage.clear()
	}

	const keychainModal = {
		open: (info?: TKeychain) => {
			// open Modal form with keychain info, blank if otherwise
			mutateKeychain(info ? info : INIT_KEYCHAIN)
			setIsOpenModalForm(true)
		},
		close: () => {
			setIsOpenModalForm(false)
			// set the keychain state to initial values
			mutateKeychain(INIT_KEYCHAIN)
			// then show Vault (keychain list)
			setFormContent(vault_component)
		},
		toggle: (toggle: boolean) => (toggle ? keychainModal.open() : keychainModal.close()),
	}

	// process indicator while oAuth
	if (loading)
		return (
			<BusyIndicator
				title="Please wait..."
				subTitle={message}
			/>
		)

	// add/provide for menu details here
	const menuItems: IMenuItem[] = [
		{
			name: 'Add Keychain',
			iconName: 'fa fa-plus',
			animation: 'fa fa-beat-fade',
			navigateTo: '',
			onClick: () => keychainModal.open(),
		},
		{
			name: 'Import',
			iconName: 'fa fa-upload',
			animation: 'fa fa-bounce',
			navigateTo: '',
			onClick: () => {
				ImportCSVToJSON(importedVault => {
					if (importedVault && importedVault.length > 0) {
						// Transform imported data to match keychain structure
						const transformedVault = importedVault.map(item => ({
							keychainId: GenerateUUID(),
							website: item.website ?? '',
							username: item.username ?? '',
							password: item.password ?? '',
							logo: item.logo ?? '',
							timeAgo: item.timeAgo ?? new Date().toString(),
						}))

						// Update state with the merged vault
						syncVaultUpdate([...vault, ...transformedVault])
					}
				}, vault)
			},
		},
		{
			name: IsEmpty(vault) ? '' : 'Export',
			iconName: 'fa fa-download',
			animation: 'fa fa-bounce',
			navigateTo: '',
			onClick: () => ExportToCSV(vault),
		},
		{
			name: 'Logout',
			iconName: 'fa fa-solid fa-unlock-keyhole',
			animation: 'fa fa-beat-fade',
			navigateTo: '/login',
			onClick: handleLogout,
		},
	]

	return (
		<div className="vault-container">
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

			<MenubarContainer {...{ menus: menuItems }} />

			<section className="form-container">
				<VaultHeader
					vault={vault}
					success={success}
					message={message}
					vaultCountRef={vaultCountRef}
				/>

				{formContent === 'vault_component' && (
					<>
						{vaultCountRef.current > 0 && <SearchBar searchCb={handleSearch} />}
						<KeychainCardContainer
							vault={vault}
							actionHandler={openKeychain}
						/>
					</>
				)}

				{formContent === 'keychain_component' && (
					<Keychain
						{...keychain}
						actionHandler={keychainHandler}
					/>
				)}
			</section>
		</div>
	)
}
