import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import type { TAuthProvider } from '@/types'
import { AUTH_CONTEXT } from '@/services/constants'

export const AuthSlice = createSlice({
	name: 'auth',
	initialState: AUTH_CONTEXT.authInfo,
	reducers: {
		updateAuth(state: TAuthProvider, { payload }: PayloadAction<TAuthProvider>) {
			state = payload
		},
	},
})

export const { updateAuth } = AuthSlice.actions
