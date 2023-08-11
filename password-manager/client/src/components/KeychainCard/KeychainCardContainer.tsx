import type { TKeychain } from '@/types'
import type { IKeychain } from '@/components'
import { KeychainCard } from '@/components/KeychainCard'

interface IKeychainCards extends Pick<IKeychain, 'actionHandler'> {
	vault: Omit<TKeychain, 'password' | 'timeAgo'>[]
}
/**
 * Renders a list of KeychainItem components
 * param keychain - An array of IVaultItem objects
 * param actionHandler - A callback function that is triggered when a KeychainItem is clicked
 *
 * returns A React fragment containing a list of KeychainItem components
 */
export function KeychainCardContainer({ vault, actionHandler }: IKeychainCards) {
	return (
		<div className="vault-list">
			{vault.map(({ keychainId, logo, website, username }, idx) => (
				<KeychainCard
					// combine keychainId and idx to trigger animation
					key={`${keychainId}${idx}`}
					logo={logo}
					website={website}
					subText={username}
					iconName="fa fa-chevron-right"
					onClick={() => actionHandler(keychainId)}
				/>
			))}
		</div>
	)
}
