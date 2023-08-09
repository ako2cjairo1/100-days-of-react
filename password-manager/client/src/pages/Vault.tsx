import { useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '@/assets/modules/Vault.css'
import {
	Modal,
	KeychainForm,
	Keychain,
	AnimatedIcon,
	Header,
	SearchBar,
	BusyIndicator,
} from '@/components'
import { KeychainCards } from '@/components/KeychainCard'
import { useAuthContext, useStateObj } from '@/hooks'
import type {
	TKeychain,
	TStatus,
	TRequestType,
	TVaultContent,
	TExportKeychain,
	IMenuItem,
} from '@/types'
import {
	CreateError,
	ExportToCSV,
	ImportCSVToJSON,
	IsEmpty,
	Log,
	SessionStorage,
	decryptVault,
	encryptVault,
} from '@/services/Utils'
import { RequestType, KEYCHAIN_CONST, FormContent, AUTH_CONTEXT } from '@/services/constants'
import { logoutUserService, updateVaultService } from '@/services/api'
import { MenubarContainer } from '@/components/Menubar/MenubarContainer'
import { useAppDispatch, useAppSelector } from '@/services/store/hooks'
import { selectStatusInfo, updateStatus } from '@/services/store/features/statusSlice'

const { INIT_KEYCHAIN, INIT_STATUS } = KEYCHAIN_CONST
const { add, modify, view } = RequestType
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

	// context attribs
	const {
		authInfo: { isLoggedIn, vaultKey },
		mutateAuth,
		authenticate,
	} = useAuthContext()

	// redux attribs
	const dispatch = useRef(useAppDispatch())
	const vaultStatus = useAppSelector(selectStatusInfo)

	const hydrateAndGetVault = () => {
		let decryptedVault = []
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
			dispatch.current(
				updateStatus({
					success: false,
					message: "We can't access your Vault! Try logging out and in..",
				})
			)
		}

		return decryptedVault
	}
	const hydrateAndGetVaultRef = useRef(hydrateAndGetVault)

	useLayoutEffect(() => {
		dispatch.current(updateStatus({ message: '', success: false }))
		// currently logged-in? hydrate current User's Vault
		if (isLoggedIn) {
			hydrateAndGetVaultRef.current()
			return
		}

		// otherwise, get authentication from auth server
		if (authRef.current) {
			// show authentication progress window
			dispatch.current(updateStatus({ loading: true, success: false }))
			authenticate().then(({ success }) => {
				dispatch.current(updateStatus({ loading: false }))
				if (!success) navigate.current('/login', { replace: true })
			})
			authRef.current = false
		}
	}, [authenticate, isLoggedIn])

	// encrypt current Vault, store on session storage and finally, update database
	const syncVaultUpdate = async (vault: TKeychain[]) => {
		const encryptedVault = encryptVault({ vault, vaultKey })
		// send encrypted update to database
		await updateVaultService({ encryptedVault })
		// store local copy of encryptedVault in session storage
		SessionStorage.write([['PM_encrypted_vault', encryptedVault]])
		hydrateAndGetVaultRef.current()
	}

	const mutateVault = async (
		keychainUpdate: TKeychain,
		requestType: TRequestType
	): Promise<TStatus> => {
		const currentVault: TKeychain[] = hydrateAndGetVaultRef.current()

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
			let vaultUpdate = currentVault.filter(
				({ keychainId }) => keychainId !== keychainUpdate.keychainId
			)
			// for "Add" and "Modify" actions: append timeAgo prop
			if (requestType === add || requestType === modify) {
				const keychainUpdateWithTimeAgo: TKeychain = {
					...keychainUpdate,
					timeAgo: new Date().toString(),
				}
				// clone current Vault then append Keychain update on the top of the list
				vaultUpdate = [keychainUpdateWithTimeAgo, ...vaultUpdate]
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
		if (!isLoggedIn) {
			navigate.current('/login', { replace: true })
		} else {
			authenticate().then(({ success }) =>
				!success ? navigate.current('/login', { replace: true }) : null
			)
		}
		const info = vault.find(info => info.keychainId === keychainId)
		// throw an error message if keychainId is not found
		if (!info) {
			return dispatch.current(
				updateStatus({
					success: false,
					message: 'Keychain information not found! Try again after a while.',
				})
			)
		}
		// open the keychain info
		if (!action || action === view) {
			mutateKeychain(info)
			return setFormContent(keychain_component)
		}
		// submit keychain info to Modal for update
		if (action === modify) {
			return keychainModal.open(info)
		}
	}

	const keychainHandler = (keychainId?: string) => {
		// hide keychain info and reset clipboard status
		setFormContent(vault_component)
		dispatch.current(updateStatus(INIT_STATUS))
		mutateKeychain(INIT_KEYCHAIN)
		// subsequently open a modal form if user choose to "Update" a keychain
		if (keychainId) openKeychain(keychainId, modify)
	}

	const handleSearch = (searchKey = ''): number => {
		const vaultData: TKeychain[] = hydrateAndGetVaultRef.current()
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
		try {
			// call backend to invalidate user tokens
			// ..update login info to database
			await logoutUserService()
		} catch (error) {
			Log(CreateError(error).message)
		} finally {
			// reset auth context
			mutateAuth(AUTH_CONTEXT.authInfo)
			dispatch.current(updateStatus({ success: false }))
			// clear session storage (Vault and saltKey)
			SessionStorage.clear()
		}
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
	if (vaultStatus.loading)
		return (
			<BusyIndicator
				title="Please wait..."
				subTitle={vaultStatus.message}
			/>
		)

	// add/provide for menu details here
	const menus: Partial<IMenuItem>[] = [
		{
			name: 'Add Keychain',
			iconName: 'fa fa-plus',
			animation: 'fa fa-beat-fade',
			onClick: () => keychainModal.open(),
		},
		{
			name: 'Import',
			iconName: 'fa fa-upload',
			animation: 'fa fa-bounce',
			onClick: () => {
				// TODO: callback function to copy imported keychains to Vault
				const syncToVault = (content: Partial<TExportKeychain>[]) =>
					console.log(content[0]?.username)
				ImportCSVToJSON(syncToVault)
			},
		},
		{
			name: IsEmpty(vault) ? '' : 'Export',
			iconName: 'fa fa-download',
			animation: 'fa fa-bounce',
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
			<MenubarContainer {...{ menus }} />

			<section className="form-container">
				{!IsEmpty(vault) ? (
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
								iconName="danger fa fa-ban"
								animation="fa-beat-fade"
								animateOnLoad
							/>
						</Header.Logo>
						<Header.Title
							title="There are no keychains"
							subTitle='click "+" to Add one'
						/>
					</Header>
				)}

				{formContent === vault_component ? (
					<>
						{vaultCountRef.current > 0 && <SearchBar searchCb={handleSearch} />}
						<KeychainCards
							vault={vault}
							actionHandler={openKeychain}
						/>
					</>
				) : (
					<Keychain
						{...keychain}
						actionHandler={keychainHandler}
					/>
				)}
			</section>

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
