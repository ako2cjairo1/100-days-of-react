import { Log, RunAfterSomeTime } from '@/services/Utils/password-manager.helper'
import { useRef, useState } from 'react'

interface IUseTimedCopyToClipboard {
	value: string
	message: string
	callbackFn: () => void
	timeout: number
}
const CLIPBOARD_TIMEOUT = 30
export const useTimedCopyToClipboard = ({
	value,
	message,
	callbackFn,
	timeout = CLIPBOARD_TIMEOUT,
}: Partial<IUseTimedCopyToClipboard>) => {
	const [isCopied, setIsCopied] = useState(false)
	const [statusMessage, setStatusMessage] = useState('')
	const timerRef = useRef<NodeJS.Timeout>()
	const timeoutRef = useRef<NodeJS.Timeout>()

	const clear = () => {
		navigator.clipboard.writeText('')
		setIsCopied(false)
		setStatusMessage('')
		clearInterval(timerRef.current)
		clearTimeout(timeoutRef.current)
		timerRef.current = undefined
		timeoutRef.current = undefined
	}

	const copy = () => {
		clear()

		// copy the actual value to clipboard
		navigator.clipboard.writeText(value ?? '')
		setIsCopied(true)
		Log(message)

		let countDown = timeout
		timerRef.current = RunAfterSomeTime(
			() => {
				countDown--
				setStatusMessage(`${message} (will expire in ${countDown} seconds)`)
			},
			1,
			'interval'
		)

		timeoutRef.current = RunAfterSomeTime(() => {
			// clear contents of clipboard and execute callback function(s)
			clear()
			Log('Clipboard cleared!')
			callbackFn && callbackFn()
		}, timeout)
	}

	return {
		copy,
		clear,
		statusMessage,
		isCopied,
	}
}
