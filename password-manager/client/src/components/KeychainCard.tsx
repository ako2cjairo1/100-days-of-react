import { Link } from 'react-router-dom'
import { AnimatedIcon } from './AnimatedIcon'
import { IChildren, TFunction, TKeychain } from '@/types'
import { GetDomainUrl } from '@/services/Utils/password-manager.helper'

interface IKeychainCard extends IChildren, Partial<Pick<TKeychain, 'logo' | 'website'>> {
	iconName?: string
	subText?: string
	onClick?: () => void | TFunction<string>
}
interface ILogo {
	websiteLogo?: string
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

	const Logo = ({ websiteLogo }: ILogo) => {
		const domainLogo = websiteDomain.slice(0, 1).toUpperCase()

		if (websiteLogo) {
			return (
				<img
					className="header"
					src={logo}
					loading="lazy"
					alt={domainLogo}
					onClick={onClick} // TODO: should navigate to website
				/>
			)
		}
		return (
			<AnimatedIcon
				className="card-icon"
				animation="fa-beat-fade"
				onClick={onClick} // TODO: should navigate to website
			>
				{domainLogo}
			</AnimatedIcon>
		)
	}

	return (
		<div
			className="keychain-item"
			onClick={onClick}
		>
			<Logo websiteLogo={logo} />

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
				<p className="small">{subText}</p>
			</div>
			{onClick && (
				<Link
					to="/vault"
					className="menu descend"
					onClick={onClick}
				>
					<AnimatedIcon iconName={iconName} />
				</Link>
			)}
			{children}
		</div>
	)
}
