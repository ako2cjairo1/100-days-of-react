import { IChildren, IKeychainItem, TFunction } from '@/types'
import { KeychainCard } from './KeychainCard'
import { AnimatedIcon } from './AnimatedIcon'

interface IKeychainList {
	keychains: Array<IKeychainItem>
	onClick: TFunction<[keychainId: string]>
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
			{keychains.length > 0 ? (
				keychains.map(({ keychainId, logo, website, username }) => (
					<KeychainCard
						key={keychainId}
						{...{ logo, website }}
						subText={username}
						iconName="fa fa-chevron-right"
						onClick={() => onClick(keychainId)}
					/>
				))
			) : (
				<div className="center">
					<AnimatedIcon
						className="regular"
						iconName="fa fa-face-rolling-eyes"
						animation="fa-beat-fade"
						animateOnLoad
					/>
					<p className="center descend">There are no items to list.</p>
				</div>
			)}
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
