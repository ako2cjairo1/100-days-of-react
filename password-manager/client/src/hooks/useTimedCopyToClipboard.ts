import { useRef, useState } from 'react'
import { CopyToClipboard, Log, RunAfterSomeTime } from '@/services/Utils/password-manager.helper'
import { TFunction } from '@/types'

interface IUseTimedCopyToClipboard {
	text?: string
	message: string
	callbackFn: TFunction
	expiration: number
}
const CLIPBOARD_TIMEOUT = 15
export function useTimedCopyToClipboard({
	text = '',
	message = 'Copied to clipboard!',
	callbackFn = () => null,
	expiration = CLIPBOARD_TIMEOUT,
}: Partial<IUseTimedCopyToClipboard>) {
	const [isCopied, setIsCopied] = useState(false)
	const [statusMessage, setStatusMessage] = useState(message)
	const timerRef = useRef<NodeJS.Timeout>()
	const timeoutRef = useRef<NodeJS.Timeout>()

	const clear = () => {
		CopyToClipboard('')
		setIsCopied(false)
		setStatusMessage('')
		clearInterval(timerRef.current)
		clearTimeout(timeoutRef.current)
	}

	const copy = (value?: string) => {
		let countDown = expiration

		// reset and clear all clipboards
		clear()
		// copy the actual value to clipboard
		CopyToClipboard(value ? value : text)
		setIsCopied(true)
		setStatusMessage(message)

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
			callbackFn()
		}, expiration)
	}

	return {
		copy,
		clear,
		statusMessage,
		isCopied,
	}
}
