import { FCProps, IKeychainItem } from '@/types'
import { Link } from 'react-router-dom'

/**
 * This is a functional component that represents a keychain item in a vault.
 * param {Object} props - The properties passed to the component.
 * param {string} props.logo - The logo of the keychain item.
 * param {string} props.link - The link of the keychain item.
 * param {string} props.username - The username of the keychain item.
 * param {function} [props.onClick] - The function to be called when the keychain item is clicked.
 *
 * returns {JSX.Element} A JSX element representing the keychain item.
 */
export const KeychainItem: FCProps<IKeychainItem> = ({
	keychainId,
	logo,
	website: link,
	username,
	onClick,
}) => {
	return (
		<div
			className="keychain-item"
			onClick={() => onClick && onClick(keychainId)}
		>
			<img
				src={logo}
				alt={link}
			/>
			<div className="keychain-item-description">
				<a
					href={`//${link}`}
					rel="noreferrer"
					target="_blank"
				>
					{link}
				</a>
				<p>{username}</p>
			</div>
			<Link
				to=""
				title="show details"
				className="menu descend"
				onClick={() => onClick && onClick(keychainId)}
			>
				<i className="fa fa-chevron-right small" />
			</Link>
		</div>
	)
}
