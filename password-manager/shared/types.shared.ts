export type TCredentials = {
	email: string
	password: string
}

export type TVault = {
	userId: string
	data?: string
	salt?: string
}

export type TGithubCredentials = Pick<TCredentials, "email"> & {
	githubId: string
}
