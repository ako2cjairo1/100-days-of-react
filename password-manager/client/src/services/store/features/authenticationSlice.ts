import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { TAuthProvider } from '@/types'
import { AUTH_CONTEXT } from '@/services/constants'
import { TCredentials } from '../../../../../shared/types.shared'
import { getSessionService, loginUserService, logoutUserService } from '@/services/api'
import { CreateError, SessionStorage, generateVaultKey } from '@/services/Utils'
import { ISession } from '../../../../../shared/interfaces.shared'
import { TRootState } from '../store'

export const loginUser = createAsyncThunk(
	'authentication/login',
	async (credential: TCredentials, { rejectWithValue }) => {
		try {
			return await loginUserService(credential)
		} catch (error) {
			return rejectWithValue(CreateError(error).message)
		}
	}
)

export const logoutUser = createAsyncThunk(
	'authenticate/logout',
	async (state, { rejectWithValue }) => {
		try {
			await logoutUserService()
		} catch (error) {
			rejectWithValue(CreateError(error).message)
		}
	}
)

export const fetchAuthSession = createAsyncThunk(
	'authentication/session',
	async (arg, { rejectWithValue }) => {
		try {
			const res = await getSessionService()
			return res
		} catch (error) {
			return rejectWithValue(CreateError(error).message)
		}
	}
)

const createSession = (state: TAuthProvider, action: PayloadAction<ISession>) => {
	const { email, encryptedVault, hashedPassword, salt, accessToken } = action.payload
	SessionStorage.write([['PM_encrypted_vault', encryptedVault]])

	state.email = email
	state.vaultKey = generateVaultKey({ email, hashedPassword, salt })
	state.vault = encryptedVault
	state.accessToken = accessToken ?? ''
	state.isLoggedIn = true
}

const authenticationSlice = createSlice({
	name: 'authentication',
	initialState: AUTH_CONTEXT.authInfo,
	reducers: {
		// implement state transitions funcs here...
	},
	extraReducers(builder) {
		builder.addCase(fetchAuthSession.fulfilled, createSession),
			builder.addCase(fetchAuthSession.rejected, () => AUTH_CONTEXT.authInfo),
			builder.addCase(loginUser.fulfilled, createSession),
			builder.addCase(loginUser.rejected, () => AUTH_CONTEXT.authInfo),
			builder.addCase(logoutUser.fulfilled, () => AUTH_CONTEXT.authInfo),
			builder.addCase(logoutUser.rejected, state => state)
	},
})

export default authenticationSlice.reducer
export const selectAuthInfo = (state: TRootState) => state.auth
// export const { authenticated } = authenticationSlice.actions
