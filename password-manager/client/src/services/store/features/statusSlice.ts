import { PayloadAction, createSlice } from '@reduxjs/toolkit'
import type { TStatus } from '@/types'
import { LOGIN_STATE } from '@/services/constants'
import { TRootState } from '../store'

type TStatusSlice = TStatus & { loading: boolean }
const initialState: TStatusSlice = {
	loading: false,
	...LOGIN_STATE.Status,
}

const statusSlice = createSlice({
	name: 'status',
	initialState,
	reducers: {
		updateStatus: (state: TStatusSlice, action: PayloadAction<Partial<TStatusSlice>>) => {
			// console.log(current(state))
			return { ...state, ...action.payload }
		},
	},
})

export default statusSlice.reducer
export const selectStatusInfo = (state: TRootState) => state.status
export const { updateStatus } = statusSlice.actions
