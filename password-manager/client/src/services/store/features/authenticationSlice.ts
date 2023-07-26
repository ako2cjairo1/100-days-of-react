import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { TAuthProvider } from '@/types'
import { AUTH_CONTEXT } from '@/services/constants'

const authenticationSlice = createSlice({
	name: 'authentication',
	initialState: AUTH_CONTEXT.authInfo,
	reducers: {
		// implement state transitions funcs here...
		authenticated(state: TAuthProvider, action: PayloadAction<TAuthProvider>) {
			state.accessToken = action.payload.accessToken
			state.email = action.payload.email
			state.vault = action.payload.vault
			state.vaultKey = action.payload.vault
			state.isLoggedIn = action.payload.isLoggedIn
		},
	},
})

export default authenticationSlice.reducer
export const { authenticated } = authenticationSlice.actions
