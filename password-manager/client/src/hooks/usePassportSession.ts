import { useEffect, useState } from 'react'
import { useAuthContext } from './useAuthContext'
import { getSessionService } from '@/api'
import { CreateError, Log, SessionStorage, generateVaultKey } from '@/services/Utils'
import { useNavigate } from 'react-router-dom'
import { ISession } from '../../../shared/interfaces.shared'

export const usePassportSession = (): ISession | null => {
	const [session, setSession] = useState<ISession | null>(null)
	const { isLoggedIn, mutateAuth } = useAuthContext()
	const navigate = useNavigate()

	useEffect(() => {
		const getSession = async () => {
			try {
				const userSession = await getSessionService()

				if (Object.values(userSession).some(Boolean)) {
					const { accessToken, email, hashedPassword, salt, encryptedVault } = userSession
					// generate vaultKey using combination of email, hashedPassword and "salt" from API
					const vaultKey = generateVaultKey({
						email,
						hashedPassword,
						salt,
					})
					// store Vault and vaultKey in session storage
					SessionStorage.write([
						['PM_VK', vaultKey],
						['PM_encrypted_vault', encryptedVault],
					])
					// !This maybe replaced with cookies
					mutateAuth({ email, vault: encryptedVault, vaultKey, accessToken })
					// navigate('/vault', { state: userSession })
					setSession(userSession)
				}
			} catch (error) {
				Log(CreateError(error).message)
				// something went wrong, redirect user to login page
				navigate('/login')
			}
		}

		if (!isLoggedIn) {
			getSession()
		}
	}, [isLoggedIn, mutateAuth, navigate])

	return session
}
