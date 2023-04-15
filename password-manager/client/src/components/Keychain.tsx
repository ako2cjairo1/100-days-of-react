import { useState } from 'react'
import { TFunction, TKeychain } from '@/types'
import { useDebounceToggle, useTimedCopyToClipboard } from '@/hooks'
import { SubmitButton } from './SubmitButton'
import { AnimatedIcon } from './AnimatedIcon'
import { PasswordStrength } from './PasswordStrength'
import { InlineNotification } from './InlineNotification'
import { KeychainCard } from './KeychainCard/KeychainCard'
import { TimeAgo } from '@/services/Utils/password-manager.helper'

export interface IKeychain extends Partial<TKeychain> {
	actionCallback: TFunction<[keychainId?: string]>
}
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
	const userNameClipboard = useTimedCopyToClipboard({})
	const passwordClipboard = useTimedCopyToClipboard({
		copyCallbackFn: () => setRevealPassword(false),
	})

	const handleAction = {
		copyUserName: () => {
			passwordClipboard.clear()
			userNameClipboard.copy(username)
		},
		copyPassword: () => {
			userNameClipboard.clear()
			passwordClipboard.copy(password)
		},
		showVault: () => actionCallback(),
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
				logo={logo}
				website={website}
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
							style={{ top: '40px', right: '0' }}
						>
							<AnimatedIcon
								title="Copy"
								className={`action-button small ${checkIf.canCopyUsername && 'active scale-down'}`}
								iconName={`fa ${
									!checkIf.canCopyUsername && checkIf.debounceCopyUserName
										? 'fa-check active scale-up'
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
							style={{ top: '125px', right: '0' }}
						>
							<AnimatedIcon
								title={revealPassword ? 'hide' : 'reveal'}
								className={`action-button small active`}
								iconName={`fa fa-eye${revealPassword ? '-slash scale-up' : ' scale-down'}`}
								onClick={() => setRevealPassword(prev => !prev)}
							/>
							<AnimatedIcon
								title="Copy"
								className={`action-button small ${checkIf.canCopyPassword && 'active scale-down'}`}
								iconName={`fa ${
									!checkIf.canCopyPassword && checkIf.debounceCopyPassword
										? 'fa-check active scale-up'
										: 'fa-clone'
								}`}
								onClick={handleAction.copyPassword}
							/>
						</div>
					</div>
				</div>
				{checkIf.isClipboardTriggered && (
					<InlineNotification
						className="lit-info"
						offsetYPos="98%"
						iconName="fa-solid fa-triangle-exclamation"
					>
						{userNameClipboard.isCopied
							? userNameClipboard.statusMessage
							: passwordClipboard.statusMessage}
					</InlineNotification>
				)}
			</div>

			<SubmitButton
				props={{
					variant: 'default',
					iconName: 'fa fa-pen-to-square',
				}}
				onClick={handleAction.modifyKeychain}
			>
				Edit Password
			</SubmitButton>
		</>
	)
}
