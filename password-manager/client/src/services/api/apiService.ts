import { ISession, IUpdateVault, IUserModel, TCredentials, TProvider } from '@shared'
import { AxiosInstance, VITE_PUBLIC_API_BASEURL } from '@/utils'

export async function registerUserService(
	userInfo: TCredentials
): Promise<Pick<IUserModel, 'userId' | 'email' | 'version'>> {
	return AxiosInstance.post('/user/registration', userInfo)
		.then(res => res.data)
		.catch(error => {
			throw error
		})
}

export async function loginUserService(loginInfo: TCredentials): Promise<ISession> {
	return AxiosInstance.post('/user/login', loginInfo)
		.then(res => res.data)
		.catch(error => {
			throw error
		})
}

export async function logoutUserService() {
	await AxiosInstance.post('/user/logout', null).catch(error => {
		throw error
	})
}

export async function updateVaultService({ encryptedVault }: IUpdateVault) {
	await AxiosInstance.patch('/vault/update', { encryptedVault }).catch(error => {
		throw error
	})
}

export async function getSessionService(): Promise<ISession> {
	return await AxiosInstance.post('/user/session')
		.then(res => res.data)
		.catch(error => {
			throw error
		})
}

export async function ssoService(provider: TProvider) {
	// open sso login url
	window.open(`${VITE_PUBLIC_API_BASEURL}/auth/sso?provider=${provider}`, '_self')
}
