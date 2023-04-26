import axios from 'axios'
import { TCredentials } from '@/types'
// extract api info from environment vars
const { VITE_PUBLIC_API_BASEURL, VITE_PUBLIC_API_ENDPOINT } = import.meta.env
// format API endpoint
const baseURL = `${VITE_PUBLIC_API_BASEURL}${VITE_PUBLIC_API_ENDPOINT}/user`

interface IAuthInfo {
	accessToken: string
	vault: string
	salt: string
}
export async function registerUser(userInfo: TCredentials): Promise<IAuthInfo> {
	const res = await axios.post(baseURL, userInfo, {
		// to make sure the cookie is set
		withCredentials: true,
	})
	return res.data
}

export async function loginUser(userInfo: TCredentials): Promise<IAuthInfo> {
	const res = await axios.post(`${baseURL}/login`, userInfo, {
		withCredentials: true,
	})
	return res.data
}

export async function logoutUser() {
	const res = await axios.post(
		`${baseURL}/logout`,
		{},
		{
			withCredentials: true,
		}
	)
	return res.data
}
