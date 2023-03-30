import '@/assets/modules/Vault.css'
import google from '@/assets/google.png'
import apple from '@/assets/apple.png'
import github from '@/assets/github.png'
import { Header, VaultMenu } from '@/components'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '@/hooks'
import { Modal } from '@/components/Modal'
import { useState } from 'react'
import { Log } from '@/services/Utils/password-manager.helper'
import { MainVault } from '@/components/MainVault'

export const Vault = () => {
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
			<MainVault>
				<Header>
					<h1 className="scale-up">
						<i className="fa fa-key logo-key fade-in" />
						<i className="fa fa-shield logo-shield scale-up" /> Secured Keychain
					</h1>
				</Header>
				<MainVault.List {...{ securedList, listEvent }} />
			</MainVault>

			<VaultMenu>
				<VaultMenu.Item
					name="logout"
					iconName="fa-sign-out"
					menuCb={handleLogout}
				/>
				<VaultMenu.Item
					name="add item"
					iconName="fa-plus"
					menuCb={() => setModal(true)}
				/>
			</VaultMenu>

			<Modal props={{ isOpen: modal, onClose: () => setModal(false) }}>
				TODO: Implement New item form here...
			</Modal>
			<Modal props={{ isOpen: itemModal, onClose: () => setItemModal(false) }}>
				TODO: Implement Item details here...
			</Modal>
		</div>
	)
}
