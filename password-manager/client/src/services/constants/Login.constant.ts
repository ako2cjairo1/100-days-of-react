import { TCredentials, TStatus } from '@/types'

export const LOGIN_STATE = {
	Credential: {
		email: '',
		password: '',
		confirm: '',
		isRemember: false,
	},
	Status: {
		success: false,
		message: '',
	},
} satisfies Record<'Credential', TCredentials> & Record<'Status', TStatus>
