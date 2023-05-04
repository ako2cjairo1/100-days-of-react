import axios, { AxiosRequestConfig } from 'axios'

// extract api info from environment vars
const { VITE_PUBLIC_API_BASEURL, VITE_PUBLIC_API_ENDPOINT } = import.meta.env
// format API endpoint
export const baseURL = `${VITE_PUBLIC_API_BASEURL}${VITE_PUBLIC_API_ENDPOINT}`

export const requestConfig: AxiosRequestConfig = {
	// to make sure the cookie is set
	withCredentials: true,
}

export default axios.create({
	baseURL,
	timeout: 5000,
})
