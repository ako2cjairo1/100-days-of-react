import { IUpdateVault, TCredentials } from '@shared'
import axios, { requestConfig } from './axios'

interface IAuthInfo {
	accessToken: string
	vault: string
	salt: string
}
export async function registerUserService(userInfo: TCredentials): Promise<IAuthInfo> {
	return axios
		.post('/user/registration', userInfo, requestConfig)
		.then(res => res.data)
		.catch(error => {
			throw error
		})
}

export async function loginUserService(loginInfo: TCredentials): Promise<IAuthInfo> {
	return axios
		.post('/user/login', loginInfo, requestConfig)
		.then(res => res.data)
		.catch(error => {
			throw error
		})
}

export async function logoutUserService() {
	await axios.post('/user/logout', {}, requestConfig).catch(error => {
		throw error
	})
}

export async function updateVaultService({ encryptedVault }: IUpdateVault) {
	await axios.patch('/vault/update', { encryptedVault }, requestConfig).catch(error => {
		throw error
	})
}
