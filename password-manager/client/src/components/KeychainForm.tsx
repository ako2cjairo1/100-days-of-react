import { useState } from 'react'
import { TKeychain } from '@/types'
import { useDebounceToggle, useTimedCopyToClipboard } from '@/hooks'
import { SubmitButton } from './SubmitButton'
import { AnimatedIcon } from './AnimatedIcon'
import { PasswordStrength } from './PasswordStrength'
import { InlineNotification } from './InlineNotification'
import { KeychainCard } from './KeychainCard'

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
	const userNameClipboard = useTimedCopyToClipboard({
		text: username,
		message: 'User Name copied!',
	})
	const passwordClipboard = useTimedCopyToClipboard({
		text: password,
		message: 'Password copied!',
		callbackFn: () => setRevealPassword(false),
	})
	const debounceCopyUserName = useDebounceToggle(userNameClipboard.isCopied, 2)
	const debounceCopyPassword = useDebounceToggle(passwordClipboard.isCopied, 2)

	const handleAction = {
		copyUserName: () => {
			if (!userNameClipboard.isCopied) {
				passwordClipboard.clear()
				userNameClipboard.copy()
			}
		},
		copyPassword: () => {
			if (!passwordClipboard.isCopied) {
				userNameClipboard.clear()
				passwordClipboard.copy()
			}
		},
	}

	const handleBackToKeychains = () => {
		userNameClipboard.clear()
		passwordClipboard.clear()
		setRevealPassword(false)
		// send the changes of keychain info for mutation
		updateCallback()
	}

	const checkIf = {
		isClipboardTriggered: userNameClipboard.isCopied || passwordClipboard.isCopied,
		canCopyPassword: !passwordClipboard.isCopied && password,
		canCopyUsername: !userNameClipboard.isCopied && username,
	}

	return (
		<>
			<KeychainCard
				{...{ logo, website }}
				subText="Last updated "
				onClick={handleBackToKeychains}
			/>

			<div className="keychain-item details vr">
				<div className="keychain-item-description">
					<p className="keychain-label">User Name</p>
					<div>
						<input
							className="keychain-info"
							type="text"
							autoComplete="false"
							placeholder="User Name"
							value={username}
							readOnly
							onClick={handleAction.copyUserName}
						/>
						<div
							className="action-container"
							style={{ top: '53px', right: '8px' }}
						>
							<AnimatedIcon
								className={`action-button small ${checkIf.canCopyUsername && 'active'}`}
								iconName={`fa ${
									!checkIf.canCopyUsername && debounceCopyUserName ? 'fa-check' : 'fa-clone'
								}`}
								onClick={handleAction.copyUserName}
							/>
						</div>
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
							onClick={handleAction.copyPassword}
						/>
						<div
							className="action-container"
							style={{ top: '140px', right: '8px' }}
						>
							<AnimatedIcon
								className={`action-button small active`}
								iconName={`fa fa-eye${revealPassword ? '-slash' : ''}`}
								onClick={() => setRevealPassword(prev => !prev)}
							/>
							<AnimatedIcon
								className={`action-button small ${checkIf.canCopyPassword && 'active'}`}
								iconName={`fa ${
									!checkIf.canCopyPassword && debounceCopyPassword ? 'fa-check' : 'fa-clone'
								}`}
								onClick={handleAction.copyPassword}
							/>
						</div>
					</div>
				</div>
				{checkIf.isClipboardTriggered && (
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
