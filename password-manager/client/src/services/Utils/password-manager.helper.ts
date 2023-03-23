import { IRegExObj, TConvertToStringUnion } from '@/types'
import { ChangeEvent, FocusEvent } from 'react'

const TimerType = {
	timeout: 'timeout',
	interval: 'interval',
} as const

/**
 * Combines multiple regular expressions into a single regular expression.
 * Parameters: regExObj (object containing key-value pairs of strings and regular expressions).
 * Return value: a single regular expression.
 */
export const MergeRegExObj = (regExObj: IRegExObj): RegExp => {
	let mergedRegexString = ''

	for (const key in regExObj) {
		mergedRegexString += regExObj[key].source
	}
	return new RegExp(mergedRegexString)
}

/**
 * Returns a random item from a given list.
 *
 * Parameters: list (array of items).
 * Return value: a random item from the list.
 */
export const GetRandomItem = <T>(list: T[]): T => {
	const idx = Math.floor(Math.random() * list.length)

	return list.at(idx) ?? list?.[idx]
}

/**
 * Executes a callback function after a specified amount of time, with an optional timer type.
 *
 * Parameters: callbackfn (function to be executed), seconds (time in seconds), timer type (timeout or interval).
 * Return value: timerId (ID of the timer)
 */
export const RunAfterSomeTime = (
	callbackFn: () => void,
	seconds: number,
	timerType: TConvertToStringUnion<typeof TimerType> = TimerType.timeout
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
	return () => timerId
}

/**
 * Extracts value from a regular expression string.
 *
 * param {string} regex - The regular expression string to extract value from.
 * returns {string} The extracted value from the regular expression string.
 */
export const ExtractValFromRegEx = (regex: string) => {
	let extractedValues = ''
	if (regex.includes('{')) {
		extractedValues =
			regex
				.match(/\{(.*?)\}/g)
				?.toString()
				.replace(/\{|\}/g, '') ?? ''
	}
	if (regex.includes('[')) {
		extractedValues +=
			regex
				.match(/\[(.*?)\]/g)
				?.toString()
				.replace(/\[|\]/g, '') ?? ''
	}
	return extractedValues
}

/**
 * Overrides the target properties "id" and "value" of an Event instance.
 *
 * template T - The type of Event instance to override. Can be ChangeEvent or FocusEvent.
 * template TObj - The type of object containing the target properties to override. Must have "id" and "value" properties.
 * param {TObj} eventTargetProps - The object containing the target properties to override.
 * returns {T} The overridden Event instance with updated target properties.
 */
export const OverrideEventTarget = <
	T extends ChangeEvent<HTMLInputElement> extends infer Evt ? Evt : FocusEvent<HTMLInputElement>,
	TObj = Record<string, string | boolean> //{ id: string; value: string | boolean }
>(
	eventTargetProps: TObj
) => {
	// create an instance of Event by assertion (ChangeEvent, FocusEvent)
	const sourceEvent = {} as T

	// override the target properties "id" and "value" of Event
	return {
		...sourceEvent,
		target: { ...sourceEvent.target, ...eventTargetProps },
	}
}

/**
 * This function takes in an object and an optional initial value and returns a new object with the same keys as the input object and boolean values.
 * param targetObj - The input object whose keys will be used to create the new object.
 * param initVal - An optional initial value for all the boolean values in the new object. Defaults to true.
 * returns A new object with the same keys as the input object and boolean values.
 */
export const ConvertPropsToBool = <T>(targetObj: T, initVal: boolean = true) => {
	const resultObj = {} as Record<TConvertToStringUnion<T>, boolean>
	// type TCOnv =

	// use same property names as targetObj
	for (let key in targetObj) {
		resultObj[key] = initVal
	}

	return resultObj
}

/**
 * This function takes in an error object of type unknown and returns a string representation of the error message.
 * If the error object is an instance of the Error class, it returns the value of its message property.
 * If the error object is an object with a message property, it returns the value of its message property.
 * Otherwise, it logs a warning to the console and returns a default error message.
 *
 * @param {unknown} error - The error object to be processed
 * @returns {string} The string representation of the error message
 */
export const CreateErrorObj = (error: unknown) => {
	let result = 'An unknown error occurred.'

	if (error instanceof Error) {
		// error is an instance of Error
		result = error.message
	} else if (typeof error === 'object' && error !== null && 'message' in error) {
		// error is an object with a message property
		result = (error as { message: string }).message
	} else {
		// error is not an instance of Error and does not have a message property
		console.warn(`${result} ${error}`)
	}
	return result
}
