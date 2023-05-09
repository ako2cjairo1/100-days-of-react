import { CreateError, Logger } from "../../../utils"
import { ParameterStore } from "../../../constant"
import axios from "axios"

const {
	GOOGLE_CLIENT_ID,
	GOOGLE_SECRET,
	GOOGLE_REDIRECT_AUTH_URL,
	GOOGLE_ACCESS_TOKEN_URL,
	GOOGLE_USER_API,
} = ParameterStore

export async function getGoogleUser(code: string) {
	try {
		const { id_token, access_token } = await getAccessToken(code)
		return getUser(id_token, access_token)
	} catch (error) {
		Logger.warn("getGoogleUser Error")
		Logger.error(CreateError(error).message)
	}
}
async function getAccessToken(code: string) {
	try {
		const { data } = await axios.post(
			GOOGLE_ACCESS_TOKEN_URL,
			{
				code: code,
				client_id: GOOGLE_CLIENT_ID,
				client_secret: GOOGLE_SECRET,
				redirect_uri: GOOGLE_REDIRECT_AUTH_URL,
				grant_type: "authorization_code",
			},
			{
				headers: { Accept: "application/json" },
			}
		)
		return data
	} catch (error) {
		Logger.warn("Google OAuth API Error")
		Logger.warn(CreateError(error).message)
	}
}
async function getUser(id_token: string, access_token: string) {
	try {
		const googleUser = await axios.get(
			`${GOOGLE_USER_API}?alt=json&access_token=${access_token}`,
			{
				headers: {
					Authorization: `Bearer ${id_token}`,
				},
			}
		)

		return googleUser.data
	} catch (error) {
		Logger.warn("Google User API Error")
		Logger.error(CreateError(error).message)
	}
}
