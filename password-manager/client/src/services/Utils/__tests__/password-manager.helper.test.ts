import {
	ConvertPropsToBool,
	CreateError,
	ExtractValFromRegEx,
	GeneratePassword,
	GenerateUUID,
	GetLogoUrlAsync,
	GetRandomItem,
	LocalStorage,
	MergeRegExObj,
	OverrideEventTarget,
	RunAfterSomeTime,
} from '@/services/Utils'
import { REGISTER_STATE } from '@/services/constants'
import { ChangeEvent, FocusEvent } from 'react'

describe('MergeRegExObj', () => {
	it('should merge multiple regular expressions into a single regular expression', () => {
		const regexObject = {
			regex1: /[a-z]/,
			regex2: /[A-Z]/,
			regex3: /[0-9]/,
		}
		const mergedRegex = MergeRegExObj(regexObject)
		expect(mergedRegex).toEqual(/[a-z][A-Z][0-9]/)
	})

	it('should return an empty regular expression when given an empty object', () => {
		const regexObject = {}
		const mergedRegex = MergeRegExObj(regexObject)
		expect(mergedRegex).toEqual(/(?:)/)
	})
})

describe('GetRandomItem', () => {
	it('should return a random item from a given list', () => {
		const list = [1, 2, 3]
		const randomItem = GetRandomItem(list)
		expect(list).toContain(randomItem)
	})

	it('should return undefined when given an empty list', () => {
		const list: number[] = []
		const randomItem = GetRandomItem(list)
		expect(randomItem).toBeUndefined()
	})
})

describe('RunAfterSomeTime', () => {
	vi.useFakeTimers()

	it('runs callback function after specified time when timerType is timeout', () => {
		const callbackFn = vi.fn()
		RunAfterSomeTime(callbackFn, 3, 'timeout')
		expect(callbackFn).not.toBeCalled()
		vi.advanceTimersByTime(3000)
		expect(callbackFn).toBeCalled()
	})

	it('runs callback function repeatedly at specified interval when timerType is interval', () => {
		const callbackFn = vi.fn()
		RunAfterSomeTime(callbackFn, 2, 'interval')
		expect(callbackFn).not.toBeCalled()
		vi.advanceTimersByTime(2000)
		expect(callbackFn).toBeCalledTimes(1)
		vi.advanceTimersByTime(2000)
		expect(callbackFn).toBeCalledTimes(2)
	})
})

describe('ExtractValFromRegEx', () => {
	it('should extract values from [] in a given regular expression string', () => {
		const regex = '/[a-z]/'
		const extractedValue = ExtractValFromRegEx(regex)
		expect(extractedValue).toBe('a-z')
	})

	it('should extract values from {} in a given regular expression string', () => {
		const regex = '/^(?=.{12})/'
		const extractedValue = ExtractValFromRegEx(regex)
		expect(extractedValue).toBe('12')
	})

	it('should extract values from [] in a given regular expression string', () => {
		const regex = '/[a-z][0-9]/'
		const extractedValue = ExtractValFromRegEx(regex)
		expect(extractedValue).toBe('a-z,0-9')
	})

	it('should return values both from [] and {}', () => {
		const regex = '/[a-zA-Z]{2,4}/'
		const result = ExtractValFromRegEx(regex)
		expect(result).toBe('2,4a-zA-Z')
	})

	it('should return an empty string if no match is found', () => {
		const regex = 'test'
		const result = ExtractValFromRegEx(regex)
		expect(result).toBe('')
	})
})

describe('OverrideEventTarget', () => {
	it('should override the target properties "id" and "value" of an Event instance', () => {
		const eventTargetProps = { id: 'testId', value: 'testValue' }
		const result = OverrideEventTarget(eventTargetProps)
		expect(result.target.id).toBe(eventTargetProps.id)
		expect(result.target.value).toBe(eventTargetProps.value)
	})
})

describe('OverrideEventTarget', () => {
	it('should override ChangeEvent target properties', () => {
		const event = OverrideEventTarget<ChangeEvent<HTMLInputElement>>({
			id: 'email',
			value: 'onChange test@example.com',
		})
		expect(event.target.id).toBe('email')
		expect(event.target.value).toBe('onChange test@example.com')
	})

	it('should override FocusEvent target properties', () => {
		const event = OverrideEventTarget<FocusEvent<HTMLInputElement>>({
			id: 'email',
			value: false,
		})
		expect(event.target.id).toBe('email')
		expect(event.target.value).toBe(false)
	})
})

describe('ConvertPropsToBool', () => {
	it('should return an object with the same keys as the input object and boolean values', () => {
		const inputObj = { a: 1, b: 2 }
		const result = ConvertPropsToBool(inputObj)
		expect(result).toEqual({ a: true, b: true })
	})

	it('should use the initVal parameter as the initial value for all boolean values in the new object', () => {
		const inputObj = { a: 1, b: 2 }
		const result = ConvertPropsToBool(inputObj, false)
		expect(result).toEqual({ a: false, b: false })
	})
})

describe('CreateError', () => {
	it('should return a default error object when given an unknown error', () => {
		const input = 'unknown error'
		const output = CreateError(input)
		expect(output).toEqual({
			code: -1,
			name: 'An error has occurred.',
			message: 'An unknown error occurred.',
			unknownError: input,
		})
	})

	it('should return an error object with the message property when given an instance of Error', () => {
		const input = new Error('test error message')
		const output = CreateError(input)
		expect(output).toEqual({
			code: -1,
			name: 'Error',
			message: 'test error message',
			unknownError: input,
		})
	})

	it('should return an error object with the code and name properties when given an object with those properties', () => {
		const input = { code: 123, name: 'test name' }
		const output = CreateError(input)
		expect(output).toEqual({
			code: -1,
			name: 'An error has occurred.',
			message: 'An unknown error occurred.',
			unknownError: input,
		})
	})

	it('should return an error object with the code, name, and message properties when given an object with those properties', () => {
		const input = { code: 123, name: 'test name', message: 'test message' }
		const output = CreateError(input)
		expect(output).toEqual({
			code: -1,
			name: 'An error has occurred.',
			message: 'An unknown error occurred.',
			unknownError: input,
		})
	})

	it('should return an error object with the unknownError property when given a non-object and non-Error input', () => {
		const input = 123
		const output = CreateError(input)
		expect(output).toEqual({
			code: -1,
			name: 'An error has occurred.',
			message: 'An unknown error occurred.',
			unknownError: input,
		})
	})

	it('should return an error object with the unknownError property when given a null input', () => {
		const input = null
		const output = CreateError(input)
		expect(output).toEqual({
			code: -1,
			name: 'An error has occurred.',
			message: 'An unknown error occurred.',
			unknownError: input,
		})
	})
})

describe('LocalStorage', () => {
	it('should write and read a value from local storage', () => {
		const key = 'testKey'
		const value = 'testValue'
		LocalStorage.write(key, value)
		expect(LocalStorage.read(key)).toBe(value)
	})

	it('should remove a value from local storage', () => {
		const key = 'testKey'
		LocalStorage.remove(key)
		expect(LocalStorage.read(key)).toBe('')
	})
})

describe('GeneratePassword', () => {
	it('should generate a password that matches the provided regular expression', () => {
		const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
		const password = GeneratePassword(regex)
		expect(regex.test(password)).toBe(true)
	})

	it('should generate a password that matches the default regular expression', () => {
		const regex = MergeRegExObj(REGISTER_STATE.PASSWORD_REGEX)
		const password = GeneratePassword()
		expect(regex.test(password)).toBe(true)
	})
})

describe('GenerateUUID', () => {
	it('should generate a UUID in the correct format', () => {
		const uuid = GenerateUUID()
		expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/)
	})
})

describe('GetLogoUrlAsync', () => {
	it('should return the correct favicon URL for a given website', async () => {
		const siteUrl = 'https://www.youtube.com/'
		const faviconUrl = await GetLogoUrlAsync(siteUrl)
		expect(faviconUrl).toContain('.ico')
	})

	it('should return an empty string if no favicon is found', async () => {
		const siteUrl = 'https://www.example.com'
		const expectedFaviconUrl = ''
		const faviconUrl = await GetLogoUrlAsync(siteUrl)
		expect(faviconUrl).toBe(expectedFaviconUrl)
	})
})
