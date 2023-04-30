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
const headers = {
	'Content-type': 'application/json',
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

export async function logoutUserService(accessToken?: string) {
	const res = await axios.post(
		`${baseURL}/user/logout`,
		{},
		{
			...requestConfig,
			headers: {
				...headers,
				Authorization: `Bearer ${accessToken}`,
			},
		}
	)
	return res.data
}

interface IUpdateVault {
	encryptedVault: string
	accessToken?: string
}
export async function updateVaultService({ encryptedVault, accessToken }: IUpdateVault) {
	const res = await axios.post(
		`${baseURL}/vault/update`,
		{ encryptedVault },
		{
			...requestConfig,
			headers: {
				...headers,
				Authorization: `Bearer ${accessToken}`,
			},
		}
	)
	return res.data
}
