import { FCProps } from '@/types'

interface IVaultItem {
	logo: string
	link: string
	username: string
}
export const VaultItem: FCProps<IVaultItem> = ({ logo, link, username }) => {
	return (
		<div className="vault-item">
			<img
				src={logo}
				alt={link}
			/>
			<div className="vault-item-description">
				<a
					href={`//${link}`}
					rel="noreferrer"
					target="_blank"
				>
					{link}
				</a>
				<p>{username}</p>
			</div>
			<i className="fa fa-chevron-right small" />
		</div>
	)
}
