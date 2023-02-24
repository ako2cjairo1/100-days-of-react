export const getAlphabet = () => {
	let alphabet = []
	for (let i = 65; i <= 90; i++) {
		alphabet.push(String.fromCharCode(i))
	}
	return alphabet
}

export const getRandom = <T>(array: T[]) => {
	const idx = Math.floor(Math.random() * array.length)
	return array[idx] ?? ''
}
