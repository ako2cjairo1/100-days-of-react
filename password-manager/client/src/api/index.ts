import axios from 'axios'
import { TCredentials } from '@/types'

const baseURL = `${import.meta.env.VITE_PUBLIC_API_ENDPOINT}/api`
interface IAuthInfo {
	accessToken: string
	vault: string
	salt: string
}
export async function registerUser(userInfo: TCredentials): Promise<IAuthInfo> {
	const res = await axios.post(`${baseURL}/users`, userInfo, {
		// to make sure the cookie is set
		withCredentials: true,
	})
	return res.data
}

export async function loginUser(userInfo: TCredentials): Promise<IAuthInfo> {
	const res = await axios.post(`${baseURL}/users/login`, userInfo, {
		withCredentials: true,
	})
	return res.data
}

export async function logoutUser(accessToken: string) {
	const res = await axios.post(
		`${baseURL}/users/logout`,
		{},
		{
			headers: {
				Authorization: `Bearer ${accessToken}`,
			},
			withCredentials: true,
		}
	)
	return res.data
}
