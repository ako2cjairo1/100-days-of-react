import { Link } from 'react-router-dom'
import type { IChildren, TFunction, TKeychain } from '@/types'
import { GetDomainUrl } from '@/utils'
import { AnchorWrapper, AnimatedIcon } from '@/components'
import { CardLogo } from '@/components/KeychainCard'
import { useMemo } from 'react'

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
	const { domain, url } = useMemo(() => GetDomainUrl(website), [website])

	return (
		<div
			className={className}
			onClick={onClick}
		>
			<AnchorWrapper href={url}>
				<CardLogo
					logo={logo}
					website={domain}
				/>
			</AnchorWrapper>

			<div className="keychain-card-details">
				<AnchorWrapper href={url}>{domain}</AnchorWrapper>
				<p className="small">{subText}</p>
			</div>

			{onClick && (
				<Link
					data-testid="keychain-card-link"
					to="/vault"
					className="menu descend"
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
