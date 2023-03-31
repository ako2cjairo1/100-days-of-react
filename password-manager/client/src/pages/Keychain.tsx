import '@/assets/modules/Vault.css'
import google from '@/assets/google.png'
import apple from '@/assets/apple.png'
import github from '@/assets/github.png'
import { Header, Toolbar } from '@/components'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/hooks'
import { Modal } from '@/components/Modal'
import { useState } from 'react'
import { Log } from '@/services/Utils/password-manager.helper'
import { KeychainContainer } from '@/components/KeychainContainer'

/**
 * Renders a Keychain component
 * @returns A div element with the class "vault-container" containing a KeychainContainer, a Toolbar, and two Modal components
 */
export const Keychain = () => {
	const [modal, setModal] = useState(false)
	const [itemModal, setItemModal] = useState(false)

	const securedList = [
		{
			logo: apple,
			link: 'apple.com',
			username: 'ako2cjairo@icloud.com',
		},
		{
			logo: google,
			link: 'google.com',
			username: 'ako2cjairo@gmail.com',
		},
		{
			logo: github,
			link: 'github.com',
			username: 'ako2cjairo@gmail.com',
		},
	]

	const { authInfo, updateAuthInfo } = useAuthContext()
	const navigate = useNavigate()

	const handleLogout = () => {
		updateAuthInfo({
			...authInfo,
			accessToken: '',
		})
		navigate('/login')
	}

	const listEvent = (userName: string) => {
		setItemModal(true)
		Log(userName)
	}

	return (
		<div className="vault-container">
			<KeychainContainer>
				<Header>
					<h1 className="scale-up">
						<i className="fa fa-key logo-key fade-in" />
						<i className="fa fa-shield logo-shield scale-up" /> Secured Keychain
					</h1>
				</Header>
				<KeychainContainer.List {...{ securedList, listEvent }} />
			</KeychainContainer>

			<Toolbar>
				<Toolbar.Item
					name="logout"
					iconName="fa-sign-out"
					menuCb={handleLogout}
				/>
				<Toolbar.Item
					name="add item"
					iconName="fa-plus"
					menuCb={() => setModal(true)}
				/>
			</Toolbar>

			<Modal props={{ isOpen: modal, onClose: () => setModal(false) }}>
				TODO: Implement New item form here...
			</Modal>
			<Modal props={{ isOpen: itemModal, onClose: () => setItemModal(false) }}>
				TODO: Implement Item details here...
			</Modal>
		</div>
	)
}
