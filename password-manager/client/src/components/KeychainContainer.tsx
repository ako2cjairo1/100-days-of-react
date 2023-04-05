import { FCProps, IChildren, IKeychainItem, TFunction } from '@/types'
import { KeychainItem } from './KeychainItem'

interface IKeychainList {
	keychain: Array<IKeychainItem>
	event: TFunction<number>
}

/**
 * Renders a list of KeychainItem components
 * param keychain - An array of IVaultItem objects
 * param listEvent - A callback function that is triggered when a KeychainItem is clicked
 *
 * returns A React fragment containing a list of KeychainItem components
 */
const Keychain: FCProps<IKeychainList> = ({ keychain, event }) => {
	return (
		<>
			{keychain.map(({ keychainId, logo, website: link, username }, idx) => (
				<KeychainItem
					key={idx}
					onClick={event}
					{...{ keychainId, logo, website: link, username }}
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
export const KeychainContainer = ({ children }: IChildren) => {
	return <section className="form-container">{children}</section>
}

KeychainContainer.Keychain = Keychain
