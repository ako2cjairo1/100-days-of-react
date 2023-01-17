export const generateColorOptions = (count: number = 3) => {
	let colorOptions = [];
	const randomNumber: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
	const randomCharacters: string[] = ['A', 'B', 'C', 'D', 'E', 'F'];

	while (colorOptions.length < count) {
		let randomColor = '#';
		// generate random hex color
		while (randomColor.length < 7) {
			randomColor += randomNumber[Math.floor(Math.random() * randomNumber.length)];
			randomColor += randomCharacters[Math.floor(Math.random() * randomCharacters.length)];
		}
		colorOptions.push(randomColor);
	}

	return colorOptions;
};
