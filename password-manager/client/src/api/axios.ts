import axios, { AxiosRequestConfig } from 'axios'

// extract api info from environment vars
const { VITE_PUBLIC_API_BASEURL, VITE_PUBLIC_API_ENDPOINT } = import.meta.env
// format API endpoint
const baseURL = `${VITE_PUBLIC_API_BASEURL}${VITE_PUBLIC_API_ENDPOINT}`

export default axios.create({
	baseURL,
	timeout: 5000, // 5 seconds
})

export const axiosBaseConfig: AxiosRequestConfig = {
	// to make sure the cookie is set
	withCredentials: true,
}
