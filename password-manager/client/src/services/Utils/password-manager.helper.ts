import { IRegExObj, TConvertToStringUnion } from '@/types'
import { ChangeEvent, FocusEvent } from 'react'
import { REGISTER_STATE } from '../constants'

export const Log = <T>(Obj: T) => {
	if (Obj instanceof Error) console.error(Obj)
	console.log(Obj)
}

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
		mergedRegexString += regExObj[key]?.source
	}
	return new RegExp(mergedRegexString)
}

/**
 * Returns a random item from a given list.
 *
 * Parameters: list (array of items).
 * Return value: a random item from the list.
 */
export const GetRandomItem = <T>(list: T[]): T | undefined => {
	const idx = Math.floor(Math.random() * list.length)

	return list.at(idx) ?? list[0]
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
	return timerId
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
export const ConvertPropsToBool = <T>(targetObj: T, initVal = true) => {
	const resultObj = {} as Record<TConvertToStringUnion<T>, boolean>
	// type TCOnv =

	// use same property names as targetObj
	for (const key in targetObj) {
		resultObj[key] = initVal
	}

	return resultObj
}

/**
 * This function takes in an object and returns a traversed property object.
 *
 * param {object} obj - The object to be mapped.
 * returns {TraversedProperty} - The traversed property object.
 */
type TraversedProperty = Partial<{
	key: string
	value: unknown
	type: unknown
}>

export const MapUnknownObj = (obj: object): TraversedProperty => {
	let result: TraversedProperty = {}

	for (const [key, value] of Object.entries(obj)) {
		if (typeof value === 'object' && value !== null) {
			const nestedProperties = MapUnknownObj(value)
			result = { ...nestedProperties, value: MapUnknownObj(nestedProperties.value ?? {}) }
		} else {
			result = {
				key,
				value,
				type: typeof value,
			}
		}
	}
	return result
}

/**
 * This function takes in an unknown error and returns an IPasswordMangerError object.
 *
 * param {unknown} error - The error to be processed.
 * returns {IPasswordMangerError} - The processed error object.
 */
type PasswordManagerError = Error & {
	code: number | string
	unknownError?: unknown
}
export const CreateError = (error: unknown) => {
	let result: PasswordManagerError = {
		code: -1,
		name: 'An error has occurred.',
		message: 'An unknown error occurred.',
	}

	if (error instanceof Error) {
		// error is an instance of Error
		result.message = error.message
	}

	if (typeof error === 'object' && error !== null) {
		// error is an object cast to interface with a name, message or code properties
		const unknownError = error as PasswordManagerError

		if (unknownError) {
			const { code, name, message } = unknownError

			result = {
				code: code ? code : result.code,
				name: name ? name : result.name,
				message: message ? message : result.message,
				unknownError: error,
			}
		}
	} else {
		// error is not an instance of Error and does not have a message property
		result.unknownError = error
		console.warn(`${result} ${error}`)
	}

	return result
}

interface ILocalStorage {
	set: (key: string, value: string) => void
	get: (key: string) => string | null extends infer T ? T : never
	remove: (key: string) => void
}
export const LocalStorage: ILocalStorage = {
	set: (key, value) => localStorage.setItem(key, value),
	get: key => localStorage.getItem(key),
	remove: key => localStorage.removeItem(key),
}

const passwordRegex = MergeRegExObj(REGISTER_STATE.PASSWORD_REGEX)
export const GeneratePassword = (regex: RegExp = passwordRegex) => {
	let resultCombination = ''
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' +
		ExtractValFromRegEx(REGISTER_STATE.PASSWORD_REGEX.symbol.source)
	Log(characters)

	while (!regex.test(resultCombination)) {
		resultCombination = ''

		while (resultCombination.length <= 16) {
			const random = GetRandomItem(characters.split('')) ?? ''

			if (!resultCombination.includes(random)) {
				resultCombination += random
			}
		}
	}
	return resultCombination
}

export const GenerateUUID = () => {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = (Math.random() * 16) | 0
		const v = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})
}
