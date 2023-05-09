import { ISession, IUpdateVault, TCredentials, TProvider } from '@shared'
import axios, { axiosBaseConfig } from './axios'
import Axios from 'axios'

interface IAuthInfo {
	accessToken: string
	vault: string
	salt: string
}
export async function registerUserService(userInfo: TCredentials): Promise<IAuthInfo> {
	return axios
		.post('/user/registration', userInfo, axiosBaseConfig)
		.then(res => res.data)
		.catch(error => {
			throw error
		})
}

export async function loginUserService(loginInfo: TCredentials): Promise<ISession> {
	return axios
		.post('/user/login', loginInfo, axiosBaseConfig)
		.then(res => res.data)
		.catch(error => {
			throw error
		})
}

export async function logoutUserService() {
	await axios.post('/user/logout', {}, axiosBaseConfig).catch(error => {
		throw error
	})
}

export async function updateVaultService({ encryptedVault }: IUpdateVault) {
	await axios.patch('/vault/update', { encryptedVault }, axiosBaseConfig).catch(error => {
		throw error
	})
}

export async function getSessionService(): Promise<ISession> {
	return await axios
		.get('/user/session', axiosBaseConfig)
		.then(res => res.data)
		.catch(error => {
			throw error
		})
}

export function ssoService(provider: TProvider) {
	const baseUrl = import.meta.env.VITE_PUBLIC_API_BASEURL
	Axios.get(`${baseUrl}/auth/sso?provider=${provider}`, axiosBaseConfig)
		.then(res => {
			const signInUrl = res.data
			window.location.assign(signInUrl)
		})
		.catch(error => {
			throw error
		})
}
