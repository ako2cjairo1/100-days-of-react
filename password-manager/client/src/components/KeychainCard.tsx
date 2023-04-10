import { Link } from 'react-router-dom'
import { AnimatedIcon } from './AnimatedIcon'
import { IChildren, TFunction, TKeychain } from '@/types'

interface IKeychainCard extends IChildren, Partial<Pick<TKeychain, 'logo' | 'website'>> {
	iconName?: string
	subText?: string
	onClick?: () => void | TFunction<string>
}
export function KeychainCard({
	children,
	logo,
	website,
	iconName,
	subText,
	onClick,
}: IKeychainCard) {
	return (
		<div className="keychain-item">
			<img
				className="header"
				src={logo}
				alt={website}
				onClick={onClick}
			/>
			<div
				className="keychain-item-header"
				onClick={onClick}
			>
				<a
					href={`//${website}`}
					rel="noreferrer"
					target="_blank"
				>
					{website}
				</a>
				<p>{subText}</p>
			</div>
			{onClick && (
				<Link
					to="/keychain"
					// title="back to keychain"
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
