import { Link } from 'react-router-dom'
import { PasswordStrength } from './PasswordStrength'
import { TFunction, TKeychain } from '@/types'
import { useTimedCopyToClipboard } from '@/hooks'
import { useState } from 'react'

interface IKeychainForm extends Partial<TKeychain> {
	isEdit?: boolean
	updateCallback: TFunction<Partial<TKeychain>>
}
export function KeychainForm({
	logo = '',
	website = '',
	username = '',
	password = '',
	isEdit = false,
	updateCallback = () => null,
}: IKeychainForm) {
	const [revealPassword, setRevealPassword] = useState(false)
	const userNameClipboard = useTimedCopyToClipboard({ message: 'User Name copied to clipboard!' })
	const passwordClipboard = useTimedCopyToClipboard({
		message: 'Password copied to clipboard!',
		callbackFn: () => setRevealPassword(false),
	})

	const handleClipboards = (type: 'email' | 'password') => {
		if (type === 'email' && !userNameClipboard.isCopied) {
			passwordClipboard.clear()
			userNameClipboard.copy(username)
		} else if (type === 'password' && !passwordClipboard.isCopied) {
			userNameClipboard.clear()
			passwordClipboard.copy(password)
		}
	}

	const handleBackToKeychains = () => {
		userNameClipboard.clear()
		passwordClipboard.clear()
		setRevealPassword(false)
		// send the changes of keychain info for mutation
		updateCallback({})
	}

	return (
		<>
			<div className="keychain-item">
				<img
					className="header"
					src={logo}
					alt={website}
				/>
				<div
					className="keychain-item-header"
					onClick={handleBackToKeychains}
				>
					<a
						href={`//${website}`}
						rel="noreferrer"
						target="_blank"
					>
						{website}
					</a>
					<p>Last modified </p>
				</div>
				<Link
					to="/keychain"
					title="back to keychain"
					className="menu descend"
					onClick={handleBackToKeychains}
				>
					<i className="fa fa-chevron-left small" />
				</Link>
			</div>

			<div className="keychain-item details">
				<div className="keychain-item-description">
					<p>User Name</p>
					<p>Password</p>
				</div>

				<div className="keychain-item-description">
					<div>
						<input
							className="keychain-info"
							type="email"
							autoComplete="false"
							placeholder="User Name"
							value={username}
							readOnly
						/>
						<i
							className={`fa fa-clone small action-button rounded-right ${
								!userNameClipboard.isCopied && 'active'
							}`}
							onClick={() => handleClipboards('email')}
						/>
					</div>

					<PasswordStrength password={password} />

					<div>
						<input
							className="keychain-info"
							type={revealPassword ? 'text' : 'password'}
							value={password}
							readOnly
						/>
						<i
							className={`fa fa-eye${revealPassword ? '-slash' : ''} small action-button active`}
							onClick={() => setRevealPassword(prev => !prev)}
						/>
						<i
							className={`fa fa-clone small action-button rounded-right ${
								!passwordClipboard.isCopied && 'active'
							}`}
							onClick={() => handleClipboards('password')}
						/>
					</div>
				</div>

				{(userNameClipboard.isCopied || passwordClipboard.isCopied) && (
					<div className="clipboard-status">
						<i className="fa fa-check scale-up" />
						<p className="center x-small descend">
							{userNameClipboard.statusMessage}
							{passwordClipboard.statusMessage}
						</p>
					</div>
				)}
			</div>
		</>
	)
}
