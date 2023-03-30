import { FCProps, IVaultItem } from '@/types'

export const VaultItem: FCProps<IVaultItem> = ({ logo, link, username, onClick }) => {
	return (
		<div
			className="vault-item"
			onClick={() => onClick && onClick(username)}
		>
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
