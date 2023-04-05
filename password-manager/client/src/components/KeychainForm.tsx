import { Link } from 'react-router-dom'
import { PasswordStrength } from './PasswordStrength'
import { FCProps, IKeychainItem, TFunction } from '@/types'
import { useTimedCopyToClipboard } from '@/hooks'
import { useState } from 'react'
import { SubmitButton } from './SubmitButton'

export const KeychainForm: FCProps<
	Partial<IKeychainItem> & { isEdit?: boolean; cbFn: TFunction }
> = ({ logo, website: link, username, password, isEdit = false, cbFn }) => {
	const [revealPassword, setRevealPassword] = useState(false)
	const userNameClipboard = useTimedCopyToClipboard({ value: username, message: 'Email copied!' })
	const passwordClipboard = useTimedCopyToClipboard({
		value: password,
		message: 'Password copied!',
		callbackFn: () => setRevealPassword(false),
	})

	const handleClipboards = (type: 'email' | 'password') => {
		if (type === 'email' && !userNameClipboard.isCopied) {
			passwordClipboard.clear()
			userNameClipboard.copy()
		} else if (type === 'password' && !passwordClipboard.isCopied) {
			userNameClipboard.clear()
			passwordClipboard.copy()
		}
	}

	const handleBackToKeychains = () => {
		userNameClipboard.clear()
		passwordClipboard.clear()
		setRevealPassword(false)
		cbFn()
	}

	return (
		<>
			<div className="keychain-item">
				<img
					className="header"
					src={logo}
					alt={link}
				/>
				<div
					className="keychain-item-header"
					onClick={handleBackToKeychains}
				>
					<a
						href={`//${link}`}
						rel="noreferrer"
						target="_blank"
					>
						{link}
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
					{isEdit && <p>Website</p>}
					<p>User Name</p>
					<p>Password</p>
				</div>
				<div className="keychain-item-description">
					{isEdit && (
						<input
							className="keychain-info"
							type="text"
							autoComplete="false"
							placeholder="example.com"
							value={username}
						/>
					)}
					<div>
						<input
							className="keychain-info"
							type="email"
							autoComplete="false"
							placeholder="User Name"
							value={username}
							readOnly={!isEdit}
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
							readOnly={!isEdit}
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
