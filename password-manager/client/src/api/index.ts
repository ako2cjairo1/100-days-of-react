import axios, { AxiosRequestConfig } from 'axios'
import { TCredentials } from '@/types'
// extract api info from environment vars
const { VITE_PUBLIC_API_BASEURL, VITE_PUBLIC_API_ENDPOINT } = import.meta.env
// format API endpoint
const baseURL = `${VITE_PUBLIC_API_BASEURL}${VITE_PUBLIC_API_ENDPOINT}`

const requestConfig: AxiosRequestConfig = {
	// to make sure the cookie is set
	withCredentials: true,
}
interface IAuthInfo {
	accessToken: string
	vault: string
	salt: string
}
export async function registerUserService(userInfo: TCredentials): Promise<IAuthInfo> {
	const res = await axios.post(`${baseURL}/user/registration`, userInfo, requestConfig)
	return res.data
}

export async function loginUserService(loginInfo: TCredentials): Promise<IAuthInfo> {
	const res = await axios.post(`${baseURL}/user/login`, loginInfo, requestConfig)
	return res.data
}

export async function logoutUserService() {
	const res = await axios.post(`${baseURL}/user/logout`, {}, requestConfig)
	return res.data
}

export async function createVaultService() {
	const res = await axios.post(`${baseURL}/vault`, {}, requestConfig)
	return res.data
}

export async function updateVaultService(encryptedVault: string) {
	const res = await axios.post(`${baseURL}/vault/update`, { encryptedVault }, requestConfig)
	return res.data
}
