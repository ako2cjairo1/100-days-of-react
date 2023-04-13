import { IChildren, IKeychain, TKeychain } from '@/types'
import { KeychainCard } from './KeychainCard'

interface IVault extends Pick<IKeychain, 'actionCallback'> {
	vault: Omit<TKeychain, 'password' | 'timeAgo'>[]
}
/**
 * Renders a list of KeychainItem components
 * param keychain - An array of IVaultItem objects
 * param listEvent - A callback function that is triggered when a KeychainItem is clicked
 *
 * returns A React fragment containing a list of KeychainItem components
 */
function Vault({ vault, actionCallback }: IVault) {
	return (
		<>
			{vault.map(({ keychainId, logo, website, username }) => (
				<KeychainCard
					key={keychainId}
					iconName="fa fa-chevron-right"
					subText={username}
					logo={logo}
					website={website}
					onClick={() => actionCallback(keychainId)}
				/>
			))}
		</>
	)
}
/**
 * Renders a container for Keychain components
 * param children - The child components to be rendered inside the container
 *
 * returns A section element with the class "form-container" containing the child components
 */
export function VaultContainer({ children }: IChildren) {
	return <section className="form-container">{children}</section>
}

VaultContainer.Vault = Vault
