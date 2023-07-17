import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import type { TAppDispatch, TRootState } from './store'

// generic dispatch hook
export const useAppDispatch = () => useDispatch<TAppDispatch>
// generic selector hook
export const useAppSelector: TypedUseSelectorHook<TRootState> = useSelector
