import { IChildren, IKeychainItem, TFunction } from '@/types'
import { KeychainItem } from './KeychainItem'

interface IKeychainList {
	keychains: Array<IKeychainItem>
	onClick: TFunction<string>
}

/**
 * Renders a list of KeychainItem components
 * param keychain - An array of IVaultItem objects
 * param listEvent - A callback function that is triggered when a KeychainItem is clicked
 *
 * returns A React fragment containing a list of KeychainItem components
 */
function Keychain({ keychains, onClick }: IKeychainList) {
	return (
		<>
			{keychains.map(({ keychainId, logo, website, username }) => (
				<KeychainItem
					key={keychainId}
					onClick={onClick}
					{...{ keychainId, logo, website, username }}
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
export function KeychainContainer({ children }: IChildren) {
	return <section className="form-container">{children}</section>
}

KeychainContainer.Keychain = Keychain
