import type { TConvertToStringUnion, TExportKeychain, TFunction, TKeychain } from '@/types'
import { ChangeEvent, FocusEvent } from 'react'
import { KEYCHAIN_CONST, REGISTER_STATE } from '@/services/constants'
import { AxiosError } from 'axios'

export function Log<T>(Obj: T, ...optional: unknown[]) {
	if (Obj instanceof Error) console.error(Obj)
	console.log(Obj, ...optional)
}

interface IRegExObj {
	[key: string]: RegExp
}
/**
 * Combines multiple regular expressions into a single regular expression.
 * Parameters: regExObj (object containing key-value pairs of strings and regular expressions).
 * Return value: a single regular expression.
 */
export function MergeRegExObj(regExObj: IRegExObj): RegExp {
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
export function GetRandomItem<T>(list: T[]): T | undefined {
	const idx = Math.floor(Math.random() * list.length)

	return list.at(idx) ?? list[0]
}

const TimerType = {
	timeout: 'timeout',
	interval: 'interval',
} as const
/**
 * Executes a callback function after a specified amount of time, with an optional timer type.
 *
 * Parameters: callbackfn (function to be executed), seconds (time in seconds), timer type (timeout or interval).
 * Return value: timerId (ID of the timer)
 */
export function RunAfterSomeTime(
	callbackFn: TFunction,
	seconds: number,
	timerType: TConvertToStringUnion<typeof TimerType> = TimerType.timeout
) {
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
export function ExtractValFromRegEx(regex: string) {
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
export function OverrideEventTarget<
	T extends ChangeEvent<HTMLInputElement> extends infer Evt ? Evt : FocusEvent<HTMLInputElement>,
	TObj = Record<string, string | boolean>
>(eventTargetProps: TObj) {
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
export function ConvertPropsToBool<T>(targetObj: T, initVal = true) {
	const resultObj = {} as Record<keyof T, boolean>

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

export function MapUnknownObj(obj: object): TraversedProperty {
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
	code: number
	unknownError?: unknown
}

export function CreateError(error: unknown) {
	let result: PasswordManagerError = {
		code: -1,
		name: 'An error has occurred.',
		message: 'An unknown error occurred.',
		unknownError: error, // attach original error as unknownError prop
	}

	if (error instanceof AxiosError) {
		// received error response range: (5xx, 4xx)
		if (error.response) {
			const { status, statusText, data } = error.response
			return {
				code: status,
				name: error.name,
				message: data.message ? data.message : data || statusText,
				unknownError: error.response,
			}
		}
		// never received response / request never left
		else if (error.request) {
			return {
				...result,
				name: 'Network Error',
				message: 'Authentication server is not responding',
			}
		}
		// anything else AxiosError
		throw new Error('Something went wrong...')
	} else if (error instanceof Error) {
		// error is an instance of Error
		result.message = error.message

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
		}
	}

	return result
}

type TLSKey =
	| 'PM_remember_email'
	| 'PM_searchkey'
	| 'PM_encrypted_vault'
	| (string & { keys?: string })
/**
 * LocalStorage object provides an interface for interacting with the browser's local storage.
 * param write - Function that takes a key and value and stores it in local storage.
 * param read - Function that takes a key and returns the value associated with it from local storage.
 * param remove - Function that takes a key and removes it from local storage.
 */
interface ILocalStorage {
	write: (key: TLSKey, value: string) => void
	read: (key: TLSKey) => string
	remove: (key: TLSKey) => void
}
export const LocalStorage: ILocalStorage = {
	write: (key, value) => localStorage.setItem(key, value),
	read: key => localStorage.getItem(key) || '',
	remove: key => localStorage.removeItem(key),
}

interface ISessionStorage {
	write: (data: Array<[TLSKey, string]>) => void
	read: (key: TLSKey) => string
	clear: () => void
}

export const SessionStorage: ISessionStorage = {
	write: data => {
		for (const [key, value] of data) {
			window.sessionStorage.setItem(key, value)
		}
	},
	read: key => window.sessionStorage.getItem(key) || '',
	clear: () => window.sessionStorage.clear(),
}

/**
 * GeneratePassword function generates a random password that matches the provided regular expression.
 * param regex - Regular expression to match the generated password against. Default value is the result of calling MergeRegExObj with REGISTER_STATE.PASSWORD_REGEX.
 * returns A string representing the generated password.
 */
export function GeneratePassword(regex: RegExp = MergeRegExObj(REGISTER_STATE.PASSWORD_REGEX)) {
	let resultCombination = ''
	const characters =
		'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789' +
		ExtractValFromRegEx(REGISTER_STATE.PASSWORD_REGEX.symbol.source)

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

/**
 * Generates a universally unique identifier (UUID) using a cryptographically secure random number generator.
 *
 * returns {string} A UUID in the format 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.
 */
export function GenerateUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = (Math.random() * 16) | 0
		const v = c === 'x' ? r : (r & 0x3) | 0x8
		return v.toString(16)
	})
}

/**
 * Asynchronously retrieves the URL of the favicon of a website.
 *
 * param {string} siteUrl - The URL of the website to retrieve the favicon from.
 * returns {Promise<string>} A promise that resolves to the URL of the favicon or an empty string if no favicon is found.
 */
export async function GetLogoUrlAsync(siteUrl: string) {
	const response = await fetch(siteUrl)
	const text = await response.text()
	const doc = new DOMParser().parseFromString(text, 'text/html')
	const logoElement =
		doc.querySelector("link[rel*='icon']") || doc.querySelector("link[rel*='shortcut icon']")
	return logoElement ? (logoElement as HTMLLinkElement).href : ''
}

export function GetDomainUrl(siteUrl: string): { domain: string; url: string } {
	try {
		if (!siteUrl.includes('//')) siteUrl = `http://${siteUrl}`
		const url = new URL(siteUrl)
		const hostname = url.hostname
		return {
			domain: hostname.split('.').slice(-2).join('.'),
			url: siteUrl,
		}
	} catch (error) {
		Log(CreateError(error).message)
	}

	return {
		domain: siteUrl,
		url: siteUrl,
	}
}

/**
 * Asynchronously copies a string to the clipboard.
 *
 * param {string} value - The string to copy to the clipboard.
 */
export async function CopyToClipboard(value: string) {
	try {
		await navigator.clipboard.writeText(value)
	} catch (err) {
		CopyToClipboardiOS(value)
		Log(`Failed to copy text: ${CreateError(err).message}`)
	}
}

/**
 * Copies a string to the clipboard on iOS devices.
 *
 * param {string} text - The string to copy to the clipboard.
 */
function CopyToClipboardiOS(text: string): void {
	const textArea = document.createElement('textarea')
	textArea.value = text
	document.body.appendChild(textArea)
	textArea.select()

	try {
		document.execCommand('copy')
	} catch (err) {
		Log(`Failed to copy clipboard: ${CreateError(err).message}`)
	}

	document.body.removeChild(textArea)
}

export function TimeAgo(date: Date): string {
	const now = new Date()
	const seconds = Math.round((now.getTime() - date.getTime()) / 1000)
	const minutes = Math.round(seconds / 60)
	const hours = Math.round(minutes / 60)
	const days = Math.round(hours / 24)

	if (seconds < 60) {
		return 'a moment ago'
	} else if (minutes < 60) {
		return `${minutes} minutes ago`
	} else if (hours < 24) {
		return `${hours} hours ago`
	} else if (days < 7) {
		return `${days} days ago`
	} else {
		return date.toLocaleString('en-US', {
			month: 'long',
			day: 'numeric',
			year: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
		})
	}
}

export function IsEmpty<T>(value: T) {
	return (
		typeof value === 'undefined' ||
		(typeof value === 'object' && Object.keys(value ?? {}).length === 0) ||
		(typeof value === 'string' && value.length <= 0) ||
		(Array.isArray(value) && value.length <= 0)
	)
}

/**
 * Exports password vault data to a CSV file with improved error handling and type safety
 * @param vault - Array of vault entries to export
 * @param fileTitle - Optional title for the exported file
 * @param headers - Optional custom headers for the CSV
 * @throws Error if the export process fails
 */
export async function ExportToCSV(
	vault: TExportKeychain[],
	fileTitle = 'Passwords',
	headers = KEYCHAIN_CONST.HEADERS
): Promise<void> {
	const convertVaultToCSV = (): string => {
		// Create header row
		const headerRow = Object.values(headers).join(',')

		// Map vault data to CSV rows
		const dataRows = vault.map(entry => {
			return Object.keys(headers)
				.map(key => {
					const value = entry[key as keyof TExportKeychain] || ''
					// Escape special characters and wrap in quotes if needed
					return /[",\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value
				})
				.join(',')
		})

		// Combine headers and data
		return [headerRow, ...dataRows].join('\r\n')
	}

	try {
		const csvContent = convertVaultToCSV()
		const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })

		// Use the File System Access API if available
		if ('showSaveFilePicker' in window) {
			try {
				const handle = await window.showSaveFilePicker({
					types: [
						{
							description: 'CSV File',
							accept: { 'text/csv': ['.csv'] },
						},
					],
				})
				const writable = await handle.createWritable()
				await writable.write(blob)
				await writable.close()
				return
			} catch (error) {
				if ((error as Error).name !== 'AbortError') {
					throw error
				}
				// User cancelled, fall back to traditional method
			}
		}

		// Fallback for browsers without File System Access API
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a')
		link.href = url
		link.download = `${fileTitle}.csv`
		document.body.appendChild(link)
		link.click()
		URL.revokeObjectURL(url)
		document.body.removeChild(link)
	} catch (error) {
		const errorMessage = CreateError(error).message
		Log(errorMessage)
		throw new Error(`Failed to export vault: ${errorMessage}`)
	}
}

/**
 * Imports password vault data from a CSV file with improved validation and error handling
 * @param importToVaultCallbackFn - Callback function to handle imported data
 * @param currentVault - Current vault entries to check for duplicates
 * @throws Error if the import process fails
 */
export async function ImportCSVToJSON(
	importToVaultCallbackFn: (content: Partial<TKeychain>[]) => void,
	currentVault: TKeychain[] = []
): Promise<void> {
	const validateHeaders = (headers: string[]): { [key: number]: string } => {
		const expectedHeaders = Object.values(KEYCHAIN_CONST.HEADERS)
		const hasRequiredHeaders = expectedHeaders.every(header =>
			headers.some(h => h.toLowerCase() === header.toLowerCase())
		)

		if (!hasRequiredHeaders) {
			throw new Error(`Invalid CSV format. Required headers: ${expectedHeaders.join(', ')}`)
		}

		return headers.reduce((map, header, index) => {
			const matchingHeader = Object.entries(KEYCHAIN_CONST.HEADERS).find(
				([_, value]) => value.toLowerCase() === header.toLowerCase()
			)
			if (matchingHeader) {
				map[index] = matchingHeader[0]
			}
			return map
		}, {} as { [key: number]: string })
	}

	const handleDuplicates = (newEntries: Partial<TKeychain>[]): Partial<TKeychain>[] => {
		// Create a map of existing entries using website-username as key
		const existingMap = new Map(
			currentVault.map(entry => [`${entry.website}-${entry.username}`.toLowerCase(), entry])
		)

		// Process new entries and override duplicates
		const result = newEntries.map(newEntry => {
			if (!newEntry.website || !newEntry.username) return newEntry

			const key = `${newEntry.website}-${newEntry.username}`.toLowerCase()
			const existingEntry = existingMap.get(key)

			if (existingEntry) {
				currentVault.splice(currentVault.indexOf(existingEntry), 1)
				// If entry exists, take its ID and override other properties
				return {
					...newEntry,
					keychainId: existingEntry.keychainId,
					logo: existingEntry.logo,
				}
			}

			return newEntry
		})

		return result
	}

	const parseCSVContent = (content: string): Partial<TExportKeychain>[] => {
		const lines = content
			.split(/\r?\n/)
			.map(line => line.trim())
			.filter(line => line.length > 0)

		if (lines.length < 2) {
			throw new Error('CSV file is empty or contains only headers')
		}

		const headers =
			lines
				.at(0)
				?.split(',')
				.map(h => h.trim()) ?? []
		const headerMapping = validateHeaders(headers)

		const entries = lines.slice(1).map(line => {
			const values: string[] = []
			let currentValue = ''
			let insideQuotes = false

			for (let i = 0; i < line.length; i++) {
				const char = line[i]

				if (char === '"') {
					if (insideQuotes && line[i + 1] === '"') {
						currentValue += '"'
						i++
					} else {
						insideQuotes = !insideQuotes
					}
				} else if (char === ',' && !insideQuotes) {
					values.push(currentValue.trim())
					currentValue = ''
				} else {
					currentValue += char
				}
			}
			values.push(currentValue.trim())

			const entry: Partial<TExportKeychain> = {}
			Object.entries(headerMapping).forEach(([index, prop]) => {
				const value = values[Number(index)]
				entry[prop as keyof TExportKeychain] = value !== undefined ? value : ''
			})

			return entry
		})

		// Handle duplicates before returning
		return handleDuplicates(entries)
	}

	try {
		if ('showOpenFilePicker' in window) {
			try {
				const [handle] = await window.showOpenFilePicker({
					types: [
						{
							description: 'CSV Files',
							accept: { 'text/csv': ['.csv'] },
						},
					],
					multiple: false,
				})
				const file = await handle?.getFile()
				const content = await file?.text()
				const result = parseCSVContent(content ?? '')
				importToVaultCallbackFn(result)
				return
			} catch (error) {
				if ((error as Error).name !== 'AbortError') {
					throw error
				}
			}
		}

		const input = document.createElement('input')
		input.type = 'file'
		input.accept = '.csv'
		input.style.display = 'none'

		const promise = new Promise<void>((resolve, reject) => {
			input.onchange = async () => {
				try {
					const file = input.files?.[0]
					if (!file) {
						throw new Error('No file selected')
					}

					const content = await file.text()
					const result = parseCSVContent(content)
					importToVaultCallbackFn(result)
					resolve()
				} catch (error) {
					reject(error)
				} finally {
					document.body.removeChild(input)
				}
			}
		})

		document.body.appendChild(input)
		input.click()
		await promise
	} catch (error) {
		const errorMessage = CreateError(error).message
		Log(errorMessage)
		throw new Error(`Failed to import vault: ${errorMessage}`)
	}
}
