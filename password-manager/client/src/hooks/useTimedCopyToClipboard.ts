import { useRef } from 'react'
import type { TFunction } from '@/types'
import { useStateObj } from '@/hooks'
import { CopyToClipboard, IsEmpty, Log, RunAfterSomeTime } from '@/utils'

const CLIPBOARD_TIMEOUT = 15
interface IUseTimedCopyToClipboard {
	text: string
	message: string
	copyCallbackFn: TFunction
	expiration: number
}
/**
 * This function allows you to copy text to the clipboard for a specified amount of time.
 * After the specified time has passed, the clipboard is cleared and a callback function is executed.
 *
 * param {Object} options - The options object.
 * param {string} [options.text=''] - The text to be copied to the clipboard.
 * param {string} [options.message='Copied to clipboard!'] - The message to be displayed when the text is copied.
 * param {TFunction} [options.callbackFn=() => null] - The callback function to be executed when the clipboard is cleared.
 * param {number} [options.expiration=CLIPBOARD_TIMEOUT] - The time in seconds after which the clipboard will be cleared.
 *
 * returns {Object} An object containing the `copy`, `clear`, `statusMessage`, and `isCopied` properties.
 */
export function useTimedCopyToClipboard({
	text = '',
	message = 'Copied to clipboard!',
	copyCallbackFn = () => null,
	expiration = CLIPBOARD_TIMEOUT,
}: Partial<IUseTimedCopyToClipboard>) {
	const [{ isCopied, statusMessage }, mutateStatus] = useStateObj({
		isCopied: false,
		statusMessage: message,
	})
	const timerRef = useRef<NodeJS.Timeout>()
	const timeoutRef = useRef<NodeJS.Timeout>()

	const clear = () => {
		// reset and clear all clipboards
		CopyToClipboard('')
		mutateStatus({ isCopied: false, statusMessage: '' })
		clearInterval(timerRef.current)
		clearTimeout(timeoutRef.current)
	}

	const copy = (value?: string) => {
		if (!isCopied && (!IsEmpty(value) || !IsEmpty(text))) {
			// copy the actual value to clipboard
			CopyToClipboard(value ? value : text)
			// update clipboard status
			mutateStatus({ isCopied: true, statusMessage: message })
			// start the countdown to expire clipboard
			runCountDown()
		}
	}

	const runCountDown = () => {
		let countDown = expiration
		timerRef.current = RunAfterSomeTime(
			() => {
				countDown--
				mutateStatus({ statusMessage: `${message} (will expire in ${countDown} seconds)` })
			},
			1,
			'interval'
		)

		timeoutRef.current = RunAfterSomeTime(() => {
			// clear contents of clipboard
			clear()
			Log('Clipboard cleared!')
			// execute callback function(s) from subscriber
			copyCallbackFn()
		}, expiration)
	}

	return {
		copy,
		clear,
		statusMessage,
		isCopied,
	}
}
