import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/authenticationSlice'
import appStatusReducer from './features/appStatusSlice'

// wrap reducers with middleware (thunk, etc.)
export const store = configureStore({
	reducer: {
		auth: authReducer,
		appStatus: appStatusReducer,
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware(), //.concat(createLogger()),
	devTools: true,
})

export type TRootState = ReturnType<typeof store.getState>
export type TAppDispatch = typeof store.dispatch
