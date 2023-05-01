import axios, { AxiosRequestConfig } from 'axios'
import { TCredentials } from '@/types'
import { CreateError } from '@/services/Utils'
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
	return axios
		.post(`${baseURL}/user/registration`, userInfo, requestConfig)
		.then(res => res.data)
		.catch(error => CreateError(error))
}

export async function loginUserService(loginInfo: TCredentials): Promise<IAuthInfo> {
	return axios
		.post(`${baseURL}/user/login`, loginInfo, requestConfig)
		.then(res => res.data)
		.catch(error => CreateError(error))
}

export async function logoutUserService(accessToken?: string): Promise<void> {
	axios
		.post(
			`${baseURL}/user/logout`,
			{},
			{
				...requestConfig,
				headers: {
					'Content-type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
			}
		)
		.catch(error => CreateError(error))
}

interface IUpdateVault {
	encryptedVault: string
	accessToken?: string
}
export async function updateVaultService({
	encryptedVault,
	accessToken,
}: IUpdateVault): Promise<void> {
	axios
		.post(
			`${baseURL}/vault/update`,
			{ encryptedVault },
			{
				...requestConfig,
				headers: {
					'Content-type': 'application/json',
					Authorization: `Bearer ${accessToken}`,
				},
			}
		)
		.catch(error => CreateError(error))
}
