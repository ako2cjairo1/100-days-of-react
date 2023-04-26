export type TUser = {
	email: string
	password: string
	isLoggedIn?: boolean
}

export interface IUserModel extends TUser {
	userId: string
}
