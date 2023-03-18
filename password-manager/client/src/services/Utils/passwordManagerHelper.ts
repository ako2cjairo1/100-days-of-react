// Combines multiple regular expressions into a single regular expression.
// Parameters: regexobject (object containing key-value pairs of strings and regular expressions).
// Return value: a single regular expression.
export const MergeRegExObj = (regexObject: { [key: string]: RegExp }): RegExp => {
	let mergedRegexString = ''

	for (const key in regexObject) {
		mergedRegexString += regexObject[key].source
	}
	return new RegExp(mergedRegexString)
}

// Returns a random item from a given list.
// Parameters: list (array of items).
// Return value: a random item from the list.
export const GetRandomItem = <T>(list: T[]) => {
	const idx = Math.floor(Math.random() * list.length)

	return list.at(idx) ?? list?.[idx]
}

const TimerType = {
	timeout: 'timeout',
	interval: 'interval',
} as const

// Executes a callback function after a specified amount of time, with an optional timer type.
// Parameters: callbackfn (function to be executed), seconds (time in seconds), timertype (timeout or interval).
// Return value: timerid (ID of the timer)
export const RunAfterSomeTime = (
	callbackFn: () => void,
	seconds: number,
	timerType: (typeof TimerType)[keyof typeof TimerType] = TimerType.timeout
) => {
	const { timeout } = TimerType
	let timerId: NodeJS.Timeout

	if (timerType === timeout) {
		timerId = setTimeout(() => {
			callbackFn()
			clearTimeout(timerId)
		}, seconds * 1000)
	} else {
		timerId = setInterval(() => callbackFn(), seconds * 1000)
	}
	return timerId
}

export const ExtractValFromRegEx = (regex: string) => {
	if (regex.includes('{')) {
		return regex
			.match(/\{(.*?)\}/g)
			?.toString()
			.replace(/\{|\}/g, '')
	} else if (regex.includes('[')) {
		return regex
			.match(/\[(.*?)\]/g)
			?.toString()
			.replace(/\[|\]/g, '')
	} else {
		return regex
			.match(/\{(.*?)\}+\[(.*?)\]/g)
			?.toString()
			.replace(/\[|\]/g, '')
			.replace(/\{|\}/g, '')
	}
}
