import { useCallback, useState } from 'react'

/**
 * A custom hook that returns an object state and a mutate function to update the state.
 * param initialValue - The initial value of the object state.
 * returns An object containing the current state and a mutate function to update the state (fully or partially).
 */
export function useStateObj<T>(initialValue: T) {
	const [objState, setObjState] = useState<T>(initialValue)

	type TStateUpdate = T | [keyof T] | { [key: string]: unknown }
	const mutateFn = useCallback(
		(update: Partial<TStateUpdate>) => setObjState(prev => ({ ...prev, ...update })),
		[]
	)

	return [objState, mutateFn] as const
}
