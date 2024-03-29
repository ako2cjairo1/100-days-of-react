import type { IChildren, TFunction } from '@/types'
import { useState } from 'react'

type TAnimation =
	| 'fa-shake'
	| 'fa-spin'
	| 'fa-beat-fade'
	| 'spinner'
	| 'pulse'
	| 'scale-up'
	| 'scale-down'
	| 'fade-in'
	| 'spins'
	| 'descend'
	| (string & { animation?: string })
export interface IAnimatedIcon extends IChildren {
	className?: string
	iconName?: string
	title?: string
	animation?: TAnimation
	animateOnLoad?: boolean
	onClick?: TFunction
}
export function AnimatedIcon({
	children,
	className = '',
	iconName = '',
	title = '',
	animation = '',
	animateOnLoad = false,
	onClick,
}: IAnimatedIcon) {
	const [hover, setHover] = useState(false)

	const disabled = className?.includes('disabled')

	return (
		<i
			data-testid="animated-icon"
			title={title}
			className={`${className} ${iconName} ${animateOnLoad || hover ? animation : ''}`}
			onClick={onClick}
			onMouseOver={() => !disabled && setHover(true)}
			onMouseLeave={() => setHover(false)}
		>
			{children}
		</i>
	)
}
