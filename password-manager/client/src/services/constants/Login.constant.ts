import { TCredentials, TStatus } from '@/types'

export const LOGIN_STATE = {
	Credential: {
		email: '',
		password: '',
		confirm: '',
	},
	Status: {
		success: false,
		errMsg: '',
	},
} satisfies Record<'Credential', TCredentials> & Record<'Status', TStatus>
