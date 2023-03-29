import '@/assets/modules/Vault.css'
import google from '@/assets/google.png'
import apple from '@/assets/apple.png'
import github from '@/assets/github.png'
import { Header, SubmitButton, VaultItem } from '@/components'
import { useNavigate } from 'react-router-dom'
import useAuthContext from '@/hooks/useAuthContext'

export const Vault = () => {
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

	return (
		<div className="vault-container">
			<section className="form-container">
				<Header status={{ success: false, errMsg: '' }}>
					<h1 className="scale-up">
						<i className="fa fa-key logo-key fade-in" />
						<i className="fa fa-shield logo-shield scale-up" /> Secured Keychain
					</h1>
				</Header>

				{securedList.map(({ logo, link, username }, idx) => (
					<VaultItem
						key={idx}
						{...{ logo, link, username }}
					/>
				))}
			</section>
			<section className="form-container vault-container">
				<SubmitButton
					className="vault-menu descend"
					submitted={false}
					iconName="fa-user-circle"
				/>
				<SubmitButton
					title="logout"
					onClick={handleLogout}
					className="vault-menu descend"
					submitted={false}
					iconName="fa-sign-out"
				/>
			</section>
		</div>
	)
}
