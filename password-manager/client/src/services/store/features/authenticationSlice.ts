import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { TAuthProvider } from '@/types'
import { AUTH_CONTEXT } from '@/services/constants'
import { TCredentials } from '../../../../../shared/types.shared'
import { loginUserService } from '@/services/api'
import { CreateError } from '@/services/Utils'

const fetchSession = createAsyncThunk(
	'authentication/fetchSession',
	async (credential: TCredentials) => {
		try {
			const session = await loginUserService(credential)
			return session
		} catch (error) {
			return CreateError(error).message
		}
	}
)

const authenticationSlice = createSlice({
	name: 'authentication',
	initialState: AUTH_CONTEXT.authInfo,
	reducers: {
		// implement state transitions funcs here...
		authenticated: (state: TAuthProvider, action: PayloadAction<TAuthProvider>) => {
			state = action.payload
		},
	},
	extraReducers(builder) {
		builder.addCase(fetchSession.fulfilled, (state, action) => {
			state = action.payload
		})
	},
})

export default authenticationSlice.reducer
export const selectAuthInfo = (authentication: TAuthProvider) => authentication
export const { authenticated } = authenticationSlice.actions
