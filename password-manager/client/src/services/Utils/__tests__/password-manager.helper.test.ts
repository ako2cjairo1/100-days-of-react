import {
	ExtractValFromRegEx,
	GetRandomItem,
	MergeRegExObj,
	RunAfterSomeTime,
} from '@/services/Utils/password-manager.helper'

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
	it('should extract values from brackets in a given regular expression string', () => {
		const regex = '/[a-z]/'
		const extractedValue = ExtractValFromRegEx(regex)
		expect(extractedValue).toBe('a-z')
	})

	it('should extract values from curly braces in a given regular expression string', () => {
		const regex = '/^(?=.{12})/'
		const extractedValue = ExtractValFromRegEx(regex)
		expect(extractedValue).toBe('12')
	})

	it('should extract values from square brackets in a given regular expression string', () => {
		const regex = '/[a-z][0-9]/'
		const extractedValue = ExtractValFromRegEx(regex)
		expect(extractedValue).toBe('a-z,0-9')
	})
})
