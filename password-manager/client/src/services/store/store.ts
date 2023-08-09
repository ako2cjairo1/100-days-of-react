import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/authenticationSlice'
import statusReducer from './features/statusSlice'

// wrap reducers with middleware (thunk, etc.)
export const store = configureStore({
	reducer: {
		auth: authReducer,
		status: statusReducer,
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware(), //.concat(createLogger()),
	devTools: true,
})

export type TRootState = ReturnType<typeof store.getState>
export type TAppDispatch = typeof store.dispatch
