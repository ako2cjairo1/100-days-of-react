import { CreateError, Logger } from "../../../utils"
import { ParameterStore } from "../../../constant"
import axios from "axios"

const {
	FACEBOOK_CLIENT_ID,
	FACEBOOK_SECRET,
	FACEBOOK_REDIRECT_AUTH_URL,
	FACEBOOK_ACCESS_TOKEN_URL,
	FACEBOOK_USER_API,
} = ParameterStore

export async function getFacebookUser(code: string) {
	try {
		const { access_token } = await getAccessToken(code)
		return getUser(access_token)
	} catch (error) {
		Logger.warn("getFacebookUser Error")
		Logger.error(CreateError(error).message)
	}
}
async function getAccessToken(code: string) {
	try {
		const { data } = await axios.post(
			FACEBOOK_ACCESS_TOKEN_URL,
			{
				code: code,
				client_id: FACEBOOK_CLIENT_ID,
				client_secret: FACEBOOK_SECRET,
				redirect_uri: FACEBOOK_REDIRECT_AUTH_URL,
			},
			{
				headers: { Accept: "application/json" },
			}
		)
		return data
	} catch (error) {
		Logger.warn("Facebook OAuth API Error")
		Logger.warn(CreateError(error).message)
	}
}
async function getUser(access_token: string) {
	try {
		const facebookUser = await axios.get(
			`${FACEBOOK_USER_API}?fields=id,name,email`,
			{
				headers: {
					Authorization: `Bearer ${access_token}`,
				},
			}
		)

		return facebookUser.data
	} catch (error) {
		Logger.warn("Facebook User API Error")
		Logger.error(CreateError(error).message)
	}
}
