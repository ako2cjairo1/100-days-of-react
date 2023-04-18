import type { TKeychain } from '@/types'
import type { IKeychain } from '@/components'
import { KeychainCard } from '@/components/KeychainCard'

interface IVaultContainer extends Pick<IKeychain, 'actionCallback'> {
	vault: Omit<TKeychain, 'password' | 'timeAgo'>[]
}
/**
 * Renders a list of KeychainItem components
 * param keychain - An array of IVaultItem objects
 * param actionCallback - A callback function that is triggered when a KeychainItem is clicked
 *
 * returns A React fragment containing a list of KeychainItem components
 */
export function VaultContainer({ vault, actionCallback }: IVaultContainer) {
	return (
		<div className="vault-list">
			{vault.map(({ keychainId, logo, website, username }) => (
				<KeychainCard
					key={keychainId}
					logo={logo}
					website={website}
					subText={username}
					iconName="fa fa-chevron-right"
					onClick={() => actionCallback(keychainId)}
				/>
			))}
		</div>
	)
}
