import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit'
import type { TAppStatus, TAuthProvider } from '@/types'
import type { ISession, TCredentials } from '@shared'
import type { TRootState } from '@/services/store'
import { AUTH_CONTEXT } from '@/services/constants'
import { getSessionService, loginUserService, logoutUserService } from '@/services/api'
import { CreateError, SessionStorage, generateVaultKey } from '@/services/Utils'

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
	async (_, { rejectWithValue }) => {
		try {
			await logoutUserService()
		} catch (error) {
			return rejectWithValue(CreateError(error).message)
		}
	}
)

export const fetchAuthSession = createAsyncThunk(
	'authentication/session',
	async (_, { rejectWithValue }) => {
		try {
			return await getSessionService()
		} catch (error) {
			return rejectWithValue(CreateError(error).message)
		}
	}
)

type TAuthSlice = {
	auth: TAuthProvider
	loading: boolean
	success: boolean
	message: string
}

const createSession = (
	state: TAuthSlice,
	{ payload: { email, encryptedVault, hashedPassword, salt, accessToken } }: PayloadAction<ISession>
) => {
	SessionStorage.write([['PM_encrypted_vault', encryptedVault]])
	state.loading = false
	state.success = true

	state.auth.email = email
	state.auth.vaultKey = generateVaultKey({ email, hashedPassword, salt })
	state.auth.vault = encryptedVault
	state.auth.accessToken = accessToken || ''
	state.auth.isLoggedIn = true

	return state
}

const initialState: TAuthSlice = {
	auth: AUTH_CONTEXT.authInfo,
	message: '',
	success: false,
	loading: false,
}

const authenticationSlice = createSlice({
	name: 'authentication',
	initialState,
	reducers: {
		// implement state transitions funcs here...
		updateAuthStatus: (state, action: PayloadAction<Partial<TAppStatus>>) => {
			return { ...state, ...action.payload }
		},
	},
	extraReducers(builder) {
		builder
			.addCase(loginUser.pending, state => {
				state.loading = true
				state.message = ''
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				createSession(state, action)
				state.message = 'Login Successful'
			})
			.addCase(loginUser.rejected, (state, { payload }) => {
				state.loading = false
				state.message = payload as string
			})
			.addCase(logoutUser.pending, state => {
				state.loading = true
				state.message = ''
			})
			.addCase(logoutUser.fulfilled, state => {
				state.auth = initialState.auth
				state.loading = false
				state.success = false
				state.message = 'Logout Successful'
			})
			.addCase(logoutUser.rejected, (state, { payload }) => {
				state.loading = false
				state.message = payload as string
			})
			.addCase(fetchAuthSession.pending, state => {
				state.loading = true
				state.message = ''
			})
			.addCase(fetchAuthSession.fulfilled, (state, action) => {
				createSession(state, action)
				state.message = 'Authentication Successful!'
			})
			.addCase(fetchAuthSession.rejected, (state, { payload }) => {
				state.loading = false
				state.message = payload as string
			})
	},
})

export default authenticationSlice.reducer
export const selectAuthentication = (store: TRootState) => store.auth
export const { updateAuthStatus } = authenticationSlice.actions
