import '@/assets/modules/Vault.css'
import google from '@/assets/google.png'
import apple from '@/assets/apple.png'
import github from '@/assets/github.png'
import { Header, PasswordStrength, Toolbar } from '@/components'
import { useAuthContext } from '@/hooks'
import { Modal } from '@/components/Modal'
import { useEffect, useState } from 'react'
import { Log } from '@/services/Utils/password-manager.helper'
import { KeychainContainer } from '@/components/KeychainContainer'
import { IKeychainItem, TStatus } from '@/types'
import { useTimedCopyToClipboard } from '@/hooks/useTimedCopyToClipboard'

/**
 * Renders a Keychain component
 * @returns A div element with the class "vault-container" containing a KeychainContainer, a Toolbar, and two Modal components
 */
export const Keychain = () => {
	const [newKeychainModal, setNewKeychainModal] = useState(false)
	const [viewKeychainModal, setViewKeychainModal] = useState(false)
	const [keychainInfo, setKeychainInfo] = useState<Partial<IKeychainItem>>({})
	const { link, logo, username, password } = keychainInfo
	const [revealPassword, setRevealPassword] = useState(false)
	const [clipboardStatus, setClipboardStatus] = useState<TStatus>()

	const userNameClipboard = useTimedCopyToClipboard({ value: username, message: 'Email copied!' })
	const passwordClipboard = useTimedCopyToClipboard({
		value: password,
		message: 'Password copied!',
		callbackFn: () => setRevealPassword(false),
	})

	const securedList = [
		{
			logo: apple,
			link: 'apple.com',
			username: 'ako2cjairo@icloud.com',
			password: '123234',
		},
		{
			logo: google,
			link: 'google.com',
			username: 'ako2cjairo@gmail.com',
			password: 'January231990',
		},
		{
			logo: github,
			link: 'github.com',
			username: 'ako2cjairo@gmail.com',
			password: 'password123',
		},
	]

	const { authInfo, updateAuthInfo } = useAuthContext()

	const listEvent = (userName: string) => {
		setViewKeychainModal(true)

		setKeychainInfo(securedList.find(info => info.username === userName) ?? {})
		Log(userName)
	}

	useEffect(() => {
		setClipboardStatus({
			success: true,
			message: userNameClipboard.statusMessage + passwordClipboard.statusMessage,
		})
	}, [userNameClipboard.statusMessage, passwordClipboard.statusMessage])

	const handleClipboards = (type: 'email' | 'password') => {
		if (type === 'email') {
			passwordClipboard.clear()
			userNameClipboard.copy()
		} else if (type === 'password') {
			userNameClipboard.clear()
			passwordClipboard.copy()
		}
	}

	return (
		<div className="vault-container">
			<Toolbar>
				<Toolbar.Item
					name="Logout"
					iconName="fa fa-sign-out"
					navigateTo="/login"
					menuCb={() =>
						updateAuthInfo({
							...authInfo,
							accessToken: '',
						})
					}
				/>

				<Toolbar.Item
					name="add item"
					iconName="fa fa-plus"
					menuCb={() => setNewKeychainModal(true)}
				/>
			</Toolbar>

			<Modal props={{ isOpen: newKeychainModal, onClose: () => setNewKeychainModal(false) }}>
				TODO: Implement New item form here...
			</Modal>

			<KeychainContainer>
				<Header>
					<h1 className="scale-up">
						<i className="fa fa-key logo-key fade-in" />
						<i className="fa fa-shield logo-shield scale-up" /> Secured Keychain
					</h1>

					<div
						className={`center fdc ${clipboardStatus?.message ? 'fade-in' : ''}`}
						style={{ opacity: `${clipboardStatus?.message ? 1 : 0}` }}
					>
						<i className="fa fa-check scale-up regular" />
						<p className="center x-small descend">{clipboardStatus?.message}</p>
					</div>
				</Header>
				{!viewKeychainModal ? (
					<KeychainContainer.List {...{ securedList, listEvent }} />
				) : (
					<>
						<div className="keychain-item">
							<img
								className="header"
								src={logo}
								alt={link}
							/>
							<div
								className="keychain-item-header"
								onClick={() => setViewKeychainModal(false)}
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
							<i className="fa fa-chevron-left small" />
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
										className={`fa fa-eye${
											revealPassword ? '-slash' : ''
										} small action-button active`}
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
						</div>
					</>
				)}
			</KeychainContainer>
		</div>
	)
}
