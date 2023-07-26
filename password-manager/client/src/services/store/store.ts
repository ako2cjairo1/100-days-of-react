import { configureStore } from '@reduxjs/toolkit'
import { createLogger } from 'redux-logger'
import authReducer from './features/authenticationSlice'

// wrap reducers with middleware (thunk, etc.)
export const store = configureStore({
	reducer: {
		auth: authReducer,
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware().concat(createLogger()),
	devTools: true,
})

export type TRootState = ReturnType<typeof store.getState>
export type TAppDispatch = typeof store.dispatch
