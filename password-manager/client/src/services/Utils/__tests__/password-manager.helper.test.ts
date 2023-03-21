import {
	ExtractValFromRegEx,
	GetRandomItem,
	MergeRegExObj,
	OverrideEventTarget,
	RunAfterSomeTime,
} from '@/services/Utils/password-manager.helper'
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
