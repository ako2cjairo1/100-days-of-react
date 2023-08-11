import { AnimatedIcon } from '../AnimatedIcon'
import { IKeychainCard } from './KeychainCard'

/**
 * Renders a Logo component
 * param logo - The logo image URL of the keychain item
 * param website - The website URL of the keychain item
 *
 * returns A React element representing a Logo component
 */
export function CardLogo({ logo, website }: Pick<IKeychainCard, 'logo' | 'website'>) {
	const domainLogo = website?.slice(0, 1).toUpperCase()

	if (logo) {
		return (
			<img
				className="header"
				src={logo}
				alt={domainLogo}
			/>
		)
	}

	return (
		<AnimatedIcon
			className="card-icon"
			animation="fa-beat-fade"
		>
			{domainLogo}
		</AnimatedIcon>
	)
}
