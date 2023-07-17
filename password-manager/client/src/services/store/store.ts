import { configureStore } from '@reduxjs/toolkit'
import { AuthSlice } from './features'

// wrap reducers with middleware (thunk, etc.)
export const store = configureStore({
	reducer: {
		auth: AuthSlice.reducer,
	},
	middleware: getDefaultMiddleware => getDefaultMiddleware(),
	devTools: true,
})

export type TAppDispatch = typeof store.dispatch
export type TRootState = ReturnType<typeof store.getState>
