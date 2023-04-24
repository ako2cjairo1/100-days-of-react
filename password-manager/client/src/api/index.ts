import axios from 'axios'
import { CreateError } from '@/services/Utils/password-manager.helper'
import { TCredentials } from '@/types'

const baseURL = `${import.meta.env.VITE_PUBLIC_API_ENDPOINT}/api/users`

interface IRTRegisterUser {
	accessToken: string
	vaultId: string
	salt: string
}
export function registerUser(payload: TCredentials): Promise<IRTRegisterUser> {
	return axios
		.post(baseURL, payload, {
			// to make sure the cookie is set
			withCredentials: true,
		})
		.then(res => res.data)
		.catch(err => {
			throw new Error(CreateError(err).message)
		})
}
