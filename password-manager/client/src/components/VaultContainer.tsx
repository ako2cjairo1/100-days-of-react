import { IChildren, IKeychain, TKeychain } from '@/types'
import { KeychainCard } from './KeychainCard'
import { AnimatedIcon } from './AnimatedIcon'
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
	if (!vault.some(Boolean)) {
		// Empty vault, show animated message
		return (
			<div className="center">
				<AnimatedIcon
					className="regular"
					iconName="fa fa-face-rolling-eyes"
					animation="fa-beat-fade"
					animateOnLoad
				/>
				<p className="center descend">There are no items to list.</p>
			</div>
		)
	}

	return (
		<>
			{vault.map(({ keychainId, logo, website, username }) => (
				<KeychainCard
					iconName="fa fa-chevron-right"
					key={keychainId}
					subText={username}
					onClick={() => actionCallback(keychainId)}
					{...{ logo, website }}
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
