import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import type { TAppStatus } from '@/types'
import type { TRootState } from '../store'
import { LOGIN_STATE } from '@/services/constants'

const initialState: TAppStatus = {
	loading: false,
	...LOGIN_STATE.Status,
}

const appStatusSlice = createSlice({
	name: 'status',
	initialState,
	reducers: {
		updateAppStatus: (state: TAppStatus, action: PayloadAction<Partial<TAppStatus>>) => {
			return { ...state, ...action.payload }
		},
	},
})

export default appStatusSlice.reducer
export const selectAppStatus = (state: TRootState) => state.appStatus
export const { updateAppStatus } = appStatusSlice.actions
