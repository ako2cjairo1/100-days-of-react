export const getAlphabet = (isKwerty: boolean = false) => {
	let alphabet = []
	for (let code = 97; code <= 122; code++) {
		alphabet.push(String.fromCharCode(code))
	}

	if (isKwerty) {
		const standard = ['qwertyuiop', 'asdfghjkl', 'zxcvbnm']

		alphabet.sort((a, b) => {
			const rowA = standard.findIndex(letter => letter.includes(a))
			const rowB = standard.findIndex(letter => letter.includes(b))

			if (rowA === rowB) {
				return standard[rowA].indexOf(a) - standard[rowB].indexOf(b)
			} else {
				return rowA - rowB
			}
		})
	}

	return alphabet
}

export const getRandom = <T>(list: T[]) => {
	const idx = Math.floor(Math.random() * list.length)
	return list.at(idx) ?? list?.[idx]
}

export const executeAfterSomeTime = (handlerFn: () => void, seconds: number) => {
	const timerId = setTimeout(() => {
		handlerFn()
		clearTimeout(timerId)
	}, seconds * 1000)
	return timerId
}
