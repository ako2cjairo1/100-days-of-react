import { TUser } from "./User.type"

export type TVault = {
	user: TUser & {
		required: true
	}
	vault: string
	salt: string
}
