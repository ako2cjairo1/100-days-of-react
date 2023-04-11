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
	return (
		<div className="keychain-item">
			{logo ? (
				<img
					className="header"
					src={logo}
					alt={logo}
					onClick={onClick}
				/>
			) : (
				<i
					data-testid="animated-icon"
					className="card-icon"
					onClick={onClick}
				>
					{website.slice(0, 1).toUpperCase()}
				</i>
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
					{GetDomainUrl(website)}
				</a>
				<p>{subText}</p>
			</div>
			{onClick && (
				<Link
					to="/keychain"
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
