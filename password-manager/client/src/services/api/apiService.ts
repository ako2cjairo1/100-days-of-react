import { ISession, IUpdateVault, TCredentials, TProvider } from '@shared'
import { AxiosInstance, VITE_PUBLIC_API_BASEURL } from '../Utils/axios'

export async function registerUserService(
	userInfo: TCredentials
): Promise<Pick<ISession, 'accessToken' | 'encryptedVault' | 'salt'>> {
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
	AxiosInstance.get(`/auth/sso?provider=${provider}`, {
		baseURL: VITE_PUBLIC_API_BASEURL,
	})
		.then(res => {
			// open sso login url
			window.location.assign(res.data)
		})
		.catch(error => {
			throw error
		})
}
