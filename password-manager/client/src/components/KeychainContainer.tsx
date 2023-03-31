import { FCProps, IChildren, IVaultItem, TFunction } from '@/types'
import { KeychainItem } from './KeychainItem'

interface IKeychainList {
	securedList: Array<IVaultItem>
	listEvent: TFunction<string>
}

/**
 * Renders a list of KeychainItem components
 * param securedList - An array of IVaultItem objects
 * param listEvent - A callback function that is triggered when a KeychainItem is clicked
 *
 * returns A React fragment containing a list of KeychainItem components
 */
const List: FCProps<IKeychainList> = ({ securedList, listEvent }) => {
	return (
		<>
			{securedList.map(({ logo, link, username }, idx) => (
				<KeychainItem
					key={idx}
					onClick={listEvent}
					{...{ logo, link, username }}
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

KeychainContainer.List = List
