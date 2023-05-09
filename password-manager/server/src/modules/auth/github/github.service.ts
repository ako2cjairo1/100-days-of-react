import axios from "axios"
import { ParameterStore } from "../../../constant"
import { CreateError, Logger } from "../../../utils"

const {
	GITHUB_CLIENT_ID,
	GITHUB_REDIRECT_AUTH_URL,
	GITHUB_SECRET,
	GITHUB_USER_API,
} = ParameterStore

export async function getGithubUser(code: string) {
	try {
		const token = await getAccessToken(code)
		return getUser(token)
	} catch (error) {
		Logger.warn("getGithubUser Error")
		Logger.error(CreateError(error).message)
	}
}

async function getAccessToken(code: string) {
	try {
		const { data } = await axios.post(
			`${GITHUB_REDIRECT_AUTH_URL}/access_token`,
			{
				client_id: GITHUB_CLIENT_ID,
				client_secret: GITHUB_SECRET,
				code: code,
				scope: "user:email",
			},
			{
				headers: { Accept: "application/json" },
			}
		)
		return data.access_token
	} catch (error) {
		Logger.warn("Github OAuth API Error")
		Logger.error(CreateError(error).message)
	}
}

async function getUser(token: string) {
	try {
		const { data } = await axios.get(GITHUB_USER_API, {
			headers: {
				Authorization: `Bearer ${token}`,
			},
		})

		return data
	} catch (error) {
		Logger.warn("Github User API Error")
		Logger.error(CreateError(error).message)
	}
}
