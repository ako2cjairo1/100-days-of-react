import { TCredentials, TStatus } from '@/types'

export const loginInitState: { CREDENTIAL: TCredentials; STATUS: TStatus } = {
	CREDENTIAL: {
		email: '',
		password: '',
		confirm: '',
	},
	STATUS: {
		success: false,
		errMsg: '',
	},
}
