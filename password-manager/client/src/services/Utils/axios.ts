import axios, { AxiosRequestConfig } from 'axios'

// extract api info from environment vars
export const { VITE_PUBLIC_API_BASEURL, VITE_PUBLIC_API_ENDPOINT } = import.meta.env
// format API endpoint
const apiBaseURL = `${VITE_PUBLIC_API_BASEURL}${VITE_PUBLIC_API_ENDPOINT}`

export const axiosBaseConfig: AxiosRequestConfig = {
	// to make sure the cookie is set
	withCredentials: true,
	// 5 seconds response timeout
	timeout: 5000,
}

export const AxiosInstance = axios.create({
	...axiosBaseConfig,
	baseURL: apiBaseURL,
})
