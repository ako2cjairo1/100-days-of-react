export const generateColorOptions = (colorCount: number = 3) => {
	let colorOptions = [];
	while (colorOptions.length < colorCount) {
		// generate random number and convert to hex color using 'toString(16)
		colorOptions.push(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
	}

	return colorOptions;
};

export const encrypt = (text: string) => {
	const key = new Date().getTime().toString();
	let result = '';
	for (let i = 0; i < text.length; i++) {
		result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
	}
	return result;
};

export const decrypt = (text: string) => encrypt(text);
