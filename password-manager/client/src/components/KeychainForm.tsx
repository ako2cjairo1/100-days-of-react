import { Link } from 'react-router-dom'
import { PasswordStrength } from './PasswordStrength'
import { TKeychain } from '@/types'
import { useTimedCopyToClipboard } from '@/hooks'
import { useState } from 'react'
import { SubmitButton } from './SubmitButton'
import { AnimatedIcon } from './AnimatedIcon'
import { InlineNotification } from './InlineNotification'

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
	const userNameClipboard = useTimedCopyToClipboard({ message: 'User Name copied!' })
	const passwordClipboard = useTimedCopyToClipboard({
		message: 'Password copied!',
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
					<AnimatedIcon
						className="small"
						iconName="fa fa-chevron-left"
					/>
				</Link>
			</div>

			<div className="keychain-item details">
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
							onClick={() => handleClipboards('email')}
						/>
					</div>

					<div>
						<p className="keychain-label">Password</p>
						<PasswordStrength password={password} />
					</div>

					<div>
						<input
							className="keychain-info"
							type={revealPassword ? 'text' : 'password'}
							value={password}
							readOnly
							onClick={() => handleClipboards('password')}
						/>
						<AnimatedIcon
							className={`action-button small active`}
							iconName={`fa fa-eye${revealPassword ? '-slash' : ''}`}
							onClick={() => setRevealPassword(prev => !prev)}
						/>
					</div>
				</div>
				{(userNameClipboard.isCopied || passwordClipboard.isCopied) && (
					<InlineNotification>
						{userNameClipboard.isCopied
							? userNameClipboard.statusMessage
							: passwordClipboard.statusMessage}
					</InlineNotification>
				)}
			</div>

			<SubmitButton
				props={{
					variant: 'default',
					iconName: 'fa-pen-to-square',
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
