import { Link } from 'react-router-dom'
import { AnimatedIcon } from './AnimatedIcon'
import { IChildren, TFunction, TKeychain } from '@/types'
import { GetDomainUrl } from '@/services/Utils/password-manager.helper'

interface IKeychainCard extends IChildren, Partial<Pick<TKeychain, 'logo' | 'website'>> {
	iconName?: string
	subText?: string
	onClick?: () => void | TFunction<string>
}
export function KeychainCard({
	children,
	logo = '',
	website = '',
	iconName = 'fa fa-chevron-left',
	subText = '',
	onClick,
}: IKeychainCard) {
	const websiteDomain = GetDomainUrl(website)
	const domainLogo = websiteDomain.slice(0, 1).toUpperCase()
	return (
		<div className="keychain-item">
			{logo ? (
				<img
					className="header"
					src={logo}
					loading="lazy"
					alt={domainLogo}
					onClick={onClick}
				/>
			) : (
				<AnimatedIcon
					className="card-icon"
					animation="fa-beat-fade"
					onClick={onClick}
				>
					{domainLogo}
				</AnimatedIcon>
			)}
			<div
				className="keychain-item-header"
				onClick={onClick}
			>
				<a
					href={website}
					rel="noreferrer"
					target="_blank"
				>
					{websiteDomain}
				</a>
				<p>{subText}</p>
			</div>
			{onClick && (
				<Link
					to="/vault"
					className="menu descend"
					onClick={onClick}
				>
					<AnimatedIcon
						className="small"
						iconName={`${iconName ? iconName : 'fa fa-chevron-left'}`}
					/>
				</Link>
			)}
			{children}
		</div>
	)
}
