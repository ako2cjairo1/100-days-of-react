import type { TInputLogin, TStatus } from '@/types'

export const LOGIN_STATE = {
	Credential: {
		email: '',
		password: '',
		isRemember: false,
	},
	Status: {
		success: false,
		message: '',
	},
} satisfies Record<'Credential', TInputLogin> & Record<'Status', TStatus>
