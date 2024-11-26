import { useState } from 'react'
import type { TFunction, TKeychain } from '@/types'
import { useDebounceToggle, useTimedCopyToClipboard } from '@/hooks'
import {
	AnimatedIcon,
	InlineNotification,
	PasswordStrength,
	SubmitButton,
	KeychainCard,
} from '@/components'
import { TimeAgo } from '@/utils'

export interface IKeychain extends Partial<TKeychain> {
	actionHandler: TFunction<[keychainId?: string]>
}
export function Keychain({
	keychainId,
	logo = '',
	website = '',
	username = '',
	password = '',
	timeAgo = '',
	actionHandler,
}: IKeychain) {
	const [revealPassword, setRevealPassword] = useState(false)
	const userNameClipboard = useTimedCopyToClipboard({ message: 'Username is copied to clipboard!' })
	const passwordClipboard = useTimedCopyToClipboard({
		message: 'Password is copied to clipboard!',
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
		showVault: () => actionHandler(),
		// send the unique KeychainId to update in Modal
		modifyKeychain: () => actionHandler(keychainId),
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
				className="keychain-item card-header"
				subText={`Last modified ${TimeAgo(new Date(timeAgo))}`}
				onClick={handleAction.showVault}
			/>

			<div className="keychain-item details">
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
						<div className="action-container username">
							<AnimatedIcon
								title="Copy"
								className={`action-button small ${checkIf.canCopyUsername && 'active scale-down'}`}
								iconName={`fa ${!checkIf.canCopyUsername && checkIf.debounceCopyUserName
										? 'fa-circle-check active scale-up'
										: 'fa-solid fa-copy'
									}`}
								onClick={handleAction.copyUserName}
							/>
						</div>
					</div>
				</div>
			</div>

			<div className="keychain-item details vr">
				<div className="keychain-item-description">
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
						<div className="action-container password">
							<AnimatedIcon
								title={`${revealPassword ? 'Hide' : 'Reveal'} Password`}
								className={`action-button small active`}
								iconName={`fa fa-eye${revealPassword ? '-slash scale-up' : ' scale-down'}`}
								onClick={() => setRevealPassword(prev => !prev)}
							/>
							<AnimatedIcon
								title="Copy"
								className={`action-button small ${checkIf.canCopyPassword && 'active scale-down'}`}
								iconName={`fa ${!checkIf.canCopyPassword && checkIf.debounceCopyPassword
										? 'fa-circle-check active scale-up'
										: 'fa-solid fa-copy'
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

			<div>
				<SubmitButton
					props={{
						variant: 'primary',
						iconName: 'fa fa-pen-to-square',
					}}
					onClick={handleAction.modifyKeychain}
				>
					Edit Password
				</SubmitButton>
			</div>
		</>
	)
}
