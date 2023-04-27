export type TUser = {
	email: string
	password: string
}

export interface IUserModel extends TUser {
	userId: string
	version?: number
	isLoggedIn?: boolean
}
