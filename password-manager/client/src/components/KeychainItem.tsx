import { IKeychainItem } from '@/types'
import { Link } from 'react-router-dom'
import { AnimatedIcon } from './AnimatedIcon'

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
export function KeychainItem({
	keychainId,
	logo,
	website,
	username,
	onClick = () => null,
}: IKeychainItem) {
	return (
		<div
			className="keychain-item"
			onClick={() => onClick(keychainId)}
		>
			<img
				src={logo}
				alt={website}
			/>
			<div className="keychain-item-description">
				<a
					href={`//${website}`}
					rel="noreferrer"
					target="_blank"
				>
					{website}
				</a>
				<p>{username}</p>
			</div>
			<Link
				to=""
				title="show details"
				className="menu descend"
				onClick={() => onClick(keychainId)}
			>
				<AnimatedIcon
					className="small"
					iconName="fa fa-chevron-right"
				/>
			</Link>
		</div>
	)
}
