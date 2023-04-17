import { Link } from 'react-router-dom'
import { AnimatedIcon } from '../AnimatedIcon'
import { IChildren, TFunction, TKeychain } from '@/types'
import { GetDomainUrl } from '@/services/Utils/password-manager.helper'
import { Logo } from './Logo'
import { AnchorWrapper } from '@/components/AnchorWrapper'

export interface IKeychainCard extends IChildren, Partial<Pick<TKeychain, 'logo' | 'website'>> {
	className?: string
	iconName?: string
	subText?: string
	onClick?: () => void | TFunction<string>
}

/**
 * Renders a KeychainCard component
 * param children - The children elements to be rendered inside the KeychainCard
 * param logo - The logo image URL of the keychain item
 * param website - The website URL of the keychain item
 * param iconName - The name of the icon to be displayed on the right side of the KeychainCard
 * param subText - The subtext to be displayed below the website domain name
 * param onClick - A callback function that is triggered when the KeychainCard is clicked
 *
 * returns A React element representing a KeychainCard component
 */
export function KeychainCard({
	children,
	logo = '',
	website = '',
	className = 'keychain-item',
	iconName = 'fa fa-chevron-left',
	subText = '',
	onClick,
}: IKeychainCard) {
	const websiteDomain = GetDomainUrl(website)

	return (
		<div className={className}>
			<AnchorWrapper href={website}>
				<Logo
					logo={logo}
					website={websiteDomain}
				/>
			</AnchorWrapper>

			<div className="keychain-card-details">
				<AnchorWrapper href={website}>{websiteDomain}</AnchorWrapper>
				<p className="small">{subText}</p>
			</div>

			{onClick && (
				<Link
					data-testid="keychain-card-link"
					to="/vault"
					className="menu descend"
					onClick={onClick}
				>
					<AnimatedIcon
						className="x-small"
						iconName={iconName}
					/>
				</Link>
			)}
			{children}
		</div>
	)
}
