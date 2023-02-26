export const pickRandom = <T>(list: Array<T>) => {
	const randomIdx = Math.floor(Math.random() * list.length)
	return {
		value: list.at(randomIdx) ?? list?.[0],
		index: randomIdx,
	}
}

export const executeAfterSomeTime = (handlerFn: () => void, seconds: number) => {
	const timerId = setTimeout(() => {
		handlerFn()
		clearTimeout(timerId)
	}, seconds * 1000)
}
