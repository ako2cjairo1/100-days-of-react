import { Link } from 'react-router-dom'
import { PasswordStrength } from './PasswordStrength'
import { TKeychain } from '@/types'
import { useTimedCopyToClipboard } from '@/hooks'
import { useState } from 'react'
import { SubmitButton } from './SubmitButton'

interface IKeychainForm extends Partial<TKeychain> {
	updateCallback: (param?: string) => void
}
export function KeychainForm({
	keychainId,
	logo = '',
	website = '',
	username = '',
	password = '',
	updateCallback,
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
		updateCallback()
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

			<div className="keychain-item details vr">
				<div className="keychain-item-description">
					<p className="keychain-label">User Name</p>
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
							className={`fa fa-clone small action-button rounded-right ${!userNameClipboard.isCopied && 'active'
								}`}
							onClick={() => handleClipboards('email')}
						/>
					</div>

					<p className="keychain-label">Password</p>
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
							className={`fa fa-clone small action-button rounded-right ${!passwordClipboard.isCopied && 'active'
								}`}
							onClick={() => handleClipboards('password')}
						/>
					</div>
					<PasswordStrength password={password} />
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

			<SubmitButton
				props={{
					variant: 'default',
					iconName: 'fa-pencil',
					submitted: false,
					disabled: false,
				}}
				onClick={() => {
					handleBackToKeychains()
					updateCallback(keychainId)
				}}
			>
				Edit
			</SubmitButton>
		</>
	)
}
