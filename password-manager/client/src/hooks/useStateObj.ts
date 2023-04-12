import { useCallback, useState } from 'react'

export function useStateObj<T>(initialValue: T) {
	const [objState, setObjState] = useState<T>(initialValue)

	const mutate = useCallback(
		(update: Partial<T> | Partial<{ [key: string]: unknown }>) =>
			setObjState(prev => ({ ...prev, ...update })),
		[]
	)

	return { objState, mutate }
}
