export const mergeRegExObj = (regexObject: { [key: string]: RegExp }): RegExp => {
	let mergedRegexString = ''
	for (const key in regexObject) {
		mergedRegexString += regexObject[key].source
	}
	return new RegExp(mergedRegexString)
}
