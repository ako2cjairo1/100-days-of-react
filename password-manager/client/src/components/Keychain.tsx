import { useState } from 'react'
import { IKeychain } from '@/types'
import { useDebounceToggle, useTimedCopyToClipboard } from '@/hooks'
import { SubmitButton } from './SubmitButton'
import { AnimatedIcon } from './AnimatedIcon'
import { PasswordStrength } from './PasswordStrength'
import { InlineNotification } from './InlineNotification'
import { KeychainCard } from './KeychainCard'
import { TimeAgo } from '@/services/Utils/password-manager.helper'

export function Keychain({
	keychainId,
	logo = '',
	website = '',
	username = '',
	password = '',
	timeAgo = '',
	actionCallback,
}: IKeychain) {
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
		showVault: () => {
			userNameClipboard.clear()
			passwordClipboard.clear()
			setRevealPassword(false)
			// send the changes of keychain info for mutation
			actionCallback()
		},
		// send the unique KeychainId to update in Modal
		modifyKeychain: () => actionCallback(keychainId),
	}

	const checkIf = {
		isClipboardTriggered: userNameClipboard.isCopied || passwordClipboard.isCopied,
		canCopyPassword: !passwordClipboard.isCopied && password,
		canCopyUsername: !userNameClipboard.isCopied && username,
		debounceCopyUserName: useDebounceToggle(userNameClipboard.isCopied, 2),
		debounceCopyPassword: useDebounceToggle(passwordClipboard.isCopied, 2),
	}

	return (
		<>
			<KeychainCard
				{...{ logo, website }}
				subText={`Last modified ${TimeAgo(new Date(timeAgo))}`}
				onClick={handleAction.showVault}
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
							style={{ top: '42px', right: '0' }}
						>
							<AnimatedIcon
								title="copy to clipboard"
								className={`action-button small ${checkIf.canCopyUsername && 'active'}`}
								iconName={`fa ${
									!checkIf.canCopyUsername && checkIf.debounceCopyUserName
										? 'fa-check scale-up'
										: 'fa-clone'
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
							style={{ top: '130px', right: '0' }}
						>
							<AnimatedIcon
								title={revealPassword ? 'hide' : 'reveal'}
								className={`action-button small active`}
								iconName={`fa fa-eye${revealPassword ? '-slash scale-up' : ' scale-down'}`}
								onClick={() => setRevealPassword(prev => !prev)}
							/>
							<AnimatedIcon
								title="copy to clipboard"
								className={`action-button small ${checkIf.canCopyPassword && 'active'}`}
								iconName={`fa ${
									!checkIf.canCopyPassword && checkIf.debounceCopyPassword
										? 'fa-check scale-up'
										: 'fa-clone'
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
				onClick={handleAction.modifyKeychain}
			>
				Edit Password
			</SubmitButton>
		</>
	)
}
