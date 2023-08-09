import type { TInputLogin, TStatus } from '@/types'

export const LOGIN_STATE: Record<'Credential', TInputLogin> & Record<'Status', TStatus> = {
	Credential: {
		email: '',
		password: '',
		isRemember: false,
	},
	Status: {
		success: false,
		message: '',
	},
}
